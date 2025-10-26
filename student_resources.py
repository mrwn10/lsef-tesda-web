from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from database import get_db
from datetime import datetime
import os
from werkzeug.utils import secure_filename

student_resources_bp = Blueprint('student_resources', __name__)

# Folder for student submissions
UPLOAD_FOLDER = os.path.join("static", "uploads", "student_submissions")
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "jpg", "png", "jpeg"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@student_resources_bp.route("/resources")
def resources():
    """Show announcements and classwork ONLY for classes the student is enrolled in"""
    if "user_id" not in session or session.get("role") != "student":
        flash("Unauthorized access. Please login as student.")
        return redirect(url_for("auth.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Get student profile picture
    cursor.execute(
        """
        SELECT pi.profile_picture 
        FROM personal_information pi 
        WHERE pi.user_id = %s
        """,
        (session["user_id"],)
    )
    profile_data = cursor.fetchone()
    profile_picture = profile_data["profile_picture"] if profile_data else None

    # ✅ Get all class_ids where student is enrolled
    cursor.execute(
        "SELECT class_id FROM enrollment WHERE user_id = %s AND status = 'enrolled'",
        (session["user_id"],)
    )
    enrolled_classes = [row["class_id"] for row in cursor.fetchall()]

    if not enrolled_classes:
        flash("You are not enrolled in any classes yet.")
        return render_template("students/student_resources.html",
                               announcements=[],
                               classworks=[],
                               profile_picture=profile_picture,
                               user_id=session["user_id"])

    placeholders = ",".join(["%s"] * len(enrolled_classes))

    # ✅ Announcements (strictly based on enrolled classes)
    cursor.execute(
        f"""
        SELECT m.*, c.class_title, c.instructor_name
        FROM materials m
        LEFT JOIN classes c ON m.class_id = c.class_id
        WHERE m.type = 'announcement'
        AND m.class_id IN ({placeholders})
        ORDER BY m.date_uploaded DESC
        """,
        enrolled_classes
    )
    announcements = cursor.fetchall()

    # ✅ Classwork (strictly based on enrolled classes)
    cursor.execute(
        f"""
        SELECT m.*, c.class_title, c.instructor_name
        FROM materials m
        LEFT JOIN classes c ON m.class_id = c.class_id
        WHERE m.type = 'classwork'
        AND m.class_id IN ({placeholders})
        ORDER BY m.date_uploaded DESC
        """,
        enrolled_classes
    )
    classworks = cursor.fetchall()

    cursor.close()

    return render_template("students/student_resources.html",
                           announcements=announcements,
                           classworks=classworks,
                           profile_picture=profile_picture,
                           user_id=session["user_id"])

@student_resources_bp.route("/resources/classwork/<int:material_id>", methods=["GET", "POST"])
def view_classwork(material_id):
    """View classwork details and allow student submission"""
    if "user_id" not in session or session.get("role") != "student":
        flash("Unauthorized access. Please login as student.")
        return redirect(url_for("auth.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Get student profile picture
    cursor.execute(
        """
        SELECT pi.profile_picture 
        FROM personal_information pi 
        WHERE pi.user_id = %s
        """,
        (session["user_id"],)
    )
    profile_data = cursor.fetchone()
    profile_picture = profile_data["profile_picture"] if profile_data else None

    # ✅ Fetch classwork details
    cursor.execute(
        """
        SELECT m.*, c.class_title, c.instructor_name
        FROM materials m
        LEFT JOIN classes c ON m.class_id = c.class_id
        WHERE m.material_id = %s AND m.type = 'classwork'
        """,
        (material_id,)
    )
    classwork = cursor.fetchone()

    if not classwork:
        flash("Classwork not found.")
        return redirect(url_for("student_resources.resources"))

    # ✅ Ensure student is enrolled in this class
    cursor.execute(
        "SELECT 1 FROM enrollment WHERE user_id = %s AND class_id = %s AND status = 'enrolled'",
        (session["user_id"], classwork["class_id"])
    )
    if not cursor.fetchone():
        flash("You are not enrolled in this class.")
        return redirect(url_for("student_resources.resources"))

    # ✅ Handle submission
    if request.method == "POST":
        file = request.files.get("submission")
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            stored_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, stored_filename)
            file.save(filepath)

            cursor.execute(
                """
                INSERT INTO submissions (material_id, student_id, stored_filename, original_filename, date_submitted)
                VALUES (%s, %s, %s, %s, NOW())
                """,
                (material_id, session["user_id"], stored_filename, filename)
            )
            db.commit()
            flash("Your work has been submitted successfully.")
            return redirect(url_for("student_resources.view_classwork", material_id=material_id))
        else:
            flash("Invalid file type. Allowed: pdf, doc, docx, jpg, png, jpeg")

    # ✅ Fetch student's submissions
    cursor.execute(
        """
        SELECT *
        FROM submissions
        WHERE material_id = %s AND student_id = %s
        ORDER BY date_submitted DESC
        """,
        (material_id, session["user_id"])
    )
    submissions = cursor.fetchall()

    cursor.close()

    return render_template("students/student_classwork.html",
                           classwork=classwork,
                           submissions=submissions,
                           profile_picture=profile_picture,
                           user_id=session["user_id"])