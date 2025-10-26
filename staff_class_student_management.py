from flask import Blueprint, render_template, request, jsonify, session, url_for, json, send_file, redirect, flash
from datetime import datetime
from database import get_db
import io
import pandas as pd

staff_class_student_management_bp = Blueprint('staff_class_student_management', __name__)

@staff_class_student_management_bp.route('/staff_class/<int:class_id>/students', methods=['GET'])
def view_class_students(class_id):
    if 'user_id' not in session or session.get('role') != 'staff':
        return jsonify({'error': 'Unauthorized access'}), 403

    db = get_db()
    cursor = db.cursor(dictionary=True)

    staff_user_id = session.get('user_id')

    # Fetch staff profile picture
    profile_picture = 'default.png'  # fallback
    if staff_user_id:
        cursor.execute("""
            SELECT profile_picture
            FROM personal_information
            WHERE user_id = %s
        """, (staff_user_id,))
        user = cursor.fetchone()
        if user and user.get('profile_picture'):
            profile_picture = user['profile_picture']

    # Fetch students in the class
    query = """
        SELECT 
            pi.first_name, 
            pi.last_name, 
            l.email, 
            l.user_id AS user_id, 
            sg.prelim_grade, 
            sg.midterm_grade, 
            sg.final_grade, 
            sg.remarks,
            e.enrollment_id
        FROM enrollment e
        JOIN login l ON e.user_id = l.user_id
        JOIN personal_information pi ON l.user_id = pi.user_id
        LEFT JOIN student_grades sg ON e.enrollment_id = sg.enrollment_id
        WHERE e.class_id = %s AND e.status = 'enrolled'
    """
    cursor.execute(query, (class_id,))
    students = cursor.fetchall()

    return render_template(
        'staffs/staff_class_student_management.html',
        students=students,
        class_id=class_id,
        profile_picture=profile_picture
    )

@staff_class_student_management_bp.route('/staff_student/edit_grade', methods=['POST'])
def edit_student_grade():
    if 'user_id' not in session or session.get('role') != 'staff':
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.json
    enrollment_id = data.get('enrollment_id')
    prelim = data.get('prelim_grade')
    midterm = data.get('midterm_grade')
    final = data.get('final_grade')
    remarks = data.get('remarks')

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM student_grades WHERE enrollment_id = %s", (enrollment_id,))
    grade = cursor.fetchone()

    if grade:
        cursor.execute("""
            UPDATE student_grades
            SET prelim_grade=%s, midterm_grade=%s, final_grade=%s, remarks=%s, date_recorded=NOW()
            WHERE enrollment_id=%s
        """, (prelim, midterm, final, remarks, enrollment_id))
    else:
        cursor.execute("""
            INSERT INTO student_grades (enrollment_id, prelim_grade, midterm_grade, final_grade, remarks)
            VALUES (%s, %s, %s, %s, %s)
        """, (enrollment_id, prelim, midterm, final, remarks))

    db.commit()

    return jsonify({'message': 'Grade and remarks updated successfully'})

@staff_class_student_management_bp.route('/staff_student_profile/<int:user_id>', methods=['GET'])
def get_student_profile(user_id):
    if 'user_id' not in session or session.get('role') != 'staff':
        return jsonify({'error': 'Unauthorized access'}), 403

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT 
                pi.first_name, pi.middle_name, pi.last_name,
                pi.date_of_birth, pi.gender, pi.province, pi.municipality,
                pi.baranggay, pi.contact_number, pi.profile_picture,
                l.email, l.user_id
            FROM personal_information pi
            JOIN login l ON pi.user_id = l.user_id
            WHERE pi.user_id = %s
        """, (user_id,))
        profile = cursor.fetchone()

        if not profile:
            return jsonify({'error': 'Student profile not found'}), 404

        cursor.execute("""
            SELECT 
                c.class_id, 
                c.class_title, 
                c.schedule,
                c.days_of_week,
                c.venue,
                c.start_date, 
                c.end_date,
                c.instructor_name,
                e.enrollment_id, 
                e.status AS enrollment_status,
                sg.final_grade,
                sg.remarks,
                sg.date_recorded AS grade_date
            FROM enrollment e
            JOIN classes c ON e.class_id = c.class_id
            LEFT JOIN student_grades sg ON e.enrollment_id = sg.enrollment_id
            WHERE e.user_id = %s
            ORDER BY c.start_date DESC
        """, (user_id,))
        classes = cursor.fetchall()

        for cls in classes:
            if cls['days_of_week']:
                try:
                    cls['days_of_week'] = json.loads(cls['days_of_week'])
                except:
                    cls['days_of_week'] = None

        cursor.execute("""
            SELECT 
                cert.id, 
                cert.course, 
                cert.date, 
                cert.cert_hash, 
                cert.tx_hash, 
                cert.file_path,
                cert.created_at, 
                c.class_title,
                c.schedule
            FROM certificates cert
            JOIN enrollment e ON cert.enrollment_id = e.enrollment_id
            JOIN classes c ON e.class_id = c.class_id
            WHERE e.user_id = %s
            ORDER BY cert.created_at DESC
        """, (user_id,))
        certificates = cursor.fetchall()

        for cert in certificates:
            if cert['file_path']:
                clean_path = cert['file_path'].lstrip('/\\')
                if not clean_path.startswith('certs/'):
                    clean_path = f"certs/{clean_path}"
                cert['file_path'] = url_for('static', filename=clean_path)

        response = {
            'personal_info': profile,
            'classes': classes,
            'certificates': certificates,
            'success': True
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({
            'error': 'Server Error',
            'message': f'Failed to fetch student profile: {str(e)}'
        }), 500


# ====================== BULK ACTION ROUTES ======================

# DOWNLOAD Excel Grade Sheet
@staff_class_student_management_bp.route('/staff_class/<int:class_id>/download_grades', methods=['GET'])
def download_grade_sheet(class_id):
    if 'user_id' not in session or session.get('role') != 'staff':
        return jsonify({'error': 'Unauthorized access'}), 403

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            pi.first_name AS First_Name,
            pi.last_name AS Last_Name,
            l.email AS Email,
            sg.prelim_grade AS Prelim_Grade,
            sg.midterm_grade AS Midterm_Grade,
            sg.final_grade AS Final_Grade,
            sg.remarks AS Remarks
        FROM enrollment e
        JOIN login l ON e.user_id = l.user_id
        JOIN personal_information pi ON l.user_id = pi.user_id
        LEFT JOIN student_grades sg ON e.enrollment_id = sg.enrollment_id
        WHERE e.class_id = %s AND e.status = 'enrolled'
    """, (class_id,))
    
    students = cursor.fetchall()

    df = pd.DataFrame(students)

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Grades')

    output.seek(0)

    return send_file(output, download_name=f'class_{class_id}_grades.xlsx', as_attachment=True)

# UPLOAD Excel Grade Sheet
@staff_class_student_management_bp.route('/staff_class/<int:class_id>/upload_grades', methods=['POST'])
def upload_grade_sheet(class_id):
    if 'user_id' not in session or session.get('role') != 'staff':
        flash('Unauthorized access.', 'error')
        return redirect(url_for('staff_class_student_management.view_class_students', class_id=class_id))

    if 'file' not in request.files:
        flash('No file provided.', 'error')
        return redirect(url_for('staff_class_student_management.view_class_students', class_id=class_id))

    file = request.files['file']
    if file.filename == '':
        flash('Empty filename.', 'error')
        return redirect(url_for('staff_class_student_management.view_class_students', class_id=class_id))

    try:
        df = pd.read_excel(file)

        db = get_db()
        cursor = db.cursor()

        for _, row in df.iterrows():
            email = row['Email']
            prelim = row['Prelim_Grade']
            midterm = row['Midterm_Grade']
            final = row['Final_Grade']
            remarks = row['Remarks']

            # Get enrollment_id by email and class_id
            cursor.execute("""
                SELECT e.enrollment_id 
                FROM enrollment e
                JOIN login l ON e.user_id = l.user_id
                WHERE l.email = %s AND e.class_id = %s
            """, (email, class_id))
            result = cursor.fetchone()

            if result:
                enrollment_id = result[0]

                # Check if grade exists
                cursor.execute("SELECT * FROM student_grades WHERE enrollment_id = %s", (enrollment_id,))
                existing = cursor.fetchone()

                if existing:
                    cursor.execute("""
                        UPDATE student_grades
                        SET prelim_grade=%s, midterm_grade=%s, final_grade=%s, remarks=%s, date_recorded=NOW()
                        WHERE enrollment_id=%s
                    """, (prelim, midterm, final, remarks, enrollment_id))
                else:
                    cursor.execute("""
                        INSERT INTO student_grades (enrollment_id, prelim_grade, midterm_grade, final_grade, remarks)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (enrollment_id, prelim, midterm, final, remarks))

        db.commit()
        flash('Grades successfully uploaded.', 'success')
        return redirect(url_for('staff_class_student_management.view_class_students', class_id=class_id))

    except Exception as e:
        flash(f'Error processing file: {str(e)}', 'error')
        return redirect(url_for('staff_class_student_management.view_class_students', class_id=class_id))

