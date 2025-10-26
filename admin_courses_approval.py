from flask import Blueprint, render_template, request, jsonify, session, flash, redirect, url_for
from database import get_db
from datetime import datetime

admin_courses_approval_bp = Blueprint('admin_courses_approval', __name__)

@admin_courses_approval_bp.route('/courses/pending', methods=['GET'])
def view_pending_courses():
    if 'user_id' not in session or session.get('role') != 'admin':
        flash('You need to login as admin first', 'error')
        return redirect(url_for('login.login_page'))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # --- Fetch pending courses ---
        query = """
            SELECT 
                c.course_id, c.course_code, c.course_title, c.course_status,
                l.user_id, l.role,
                p.first_name, p.last_name,
                c.course_description, c.course_category, c.target_audience,
                c.prerequisites, c.learning_outcomes, c.duration_hours,
                c.course_fee, c.max_students, c.published, c.prerequisites,
                c.created_by, c.approved_by, c.date_created, c.learning_outcomes,
                c.date_updated, c.date_published, c.date_modified
            FROM courses c
            JOIN login l ON c.created_by = l.user_id
            JOIN personal_information p ON l.user_id = p.user_id
            WHERE c.course_status = 'pending' AND l.role = 'staff'
        """
        cursor.execute(query)
        courses = cursor.fetchall()

        # --- Fetch admin profile picture ---
        profile_picture = 'default.png'
        try:
            cursor.execute("""
                SELECT profile_picture 
                FROM personal_information 
                WHERE user_id = %s
            """, (session['user_id'],))
            result = cursor.fetchone()
            if result and result.get('profile_picture'):
                profile_picture = result['profile_picture']
        except Exception:
            profile_picture = 'default.png'

        return render_template(
            'admin/admin_courses_approval.html',
            courses=courses,
            profile_picture=profile_picture
        )

    except Exception as e:
        return str(e), 500
    finally:
        cursor.close()


@admin_courses_approval_bp.route('/course/details/<int:course_id>', methods=['GET'])
def get_course_details(course_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT 
                c.course_id, c.course_code, c.course_title, c.course_status,
                l.user_id, l.role,
                p.first_name, p.last_name,
                c.course_description, c.course_category, c.target_audience,
                c.prerequisites, c.learning_outcomes, c.duration_hours,
                c.course_fee, c.max_students, c.published,
                c.created_by, c.approved_by, c.date_created,
                c.date_updated, c.date_published, c.date_modified
            FROM courses c
            JOIN login l ON c.created_by = l.user_id
            JOIN personal_information p ON l.user_id = p.user_id
            WHERE c.course_id = %s
        """
        cursor.execute(query, (course_id,))
        course = cursor.fetchone()

        if course:
            return jsonify({
                'status': 'success',
                'course': {
                    'course_id': course['course_id'],
                    'course_code': course['course_code'],
                    'course_title': course['course_title'],
                    'course_description': course['course_description'],
                    'course_category': course['course_category'],
                    'target_audience': course['target_audience'],
                    'prerequisites': course['prerequisites'],
                    'learning_outcomes': course['learning_outcomes'],
                    'duration_hours': course['duration_hours'],
                    'course_fee': course['course_fee'],
                    'max_students': course['max_students'],
                    'course_status': course['course_status'],
                    'user_id': course['user_id'],
                    'role': course['role'],
                    'first_name': course['first_name'],
                    'last_name': course['last_name']
                }
            })
        else:
            return jsonify({'status': 'error', 'message': 'Course not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@admin_courses_approval_bp.route('/course/approve/<int:course_id>', methods=['POST'])
def approve_course(course_id):
    try:
        db = get_db()
        cursor = db.cursor()

        # Assuming admin user_id is stored in session as 'user_id'
        admin_user_id = session.get('user_id')

        if not admin_user_id:
            return jsonify({'status': 'error', 'message': 'Admin not logged in.'}), 401

        query = """
            UPDATE courses 
            SET course_status = 'active',
                approved_by = %s,
                date_published = %s,
                date_modified = %s
            WHERE course_id = %s
        """
        now = datetime.now()
        cursor.execute(query, (admin_user_id, now, now, course_id))
        db.commit()

        return jsonify({'status': 'success', 'message': 'Course approved successfully.'})
    except Exception as e:
        db.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@admin_courses_approval_bp.route('/course/reject/<int:course_id>', methods=['POST'])
def reject_course(course_id):
    try:
        db = get_db()
        cursor = db.cursor()

        admin_user_id = session.get('user_id')

        if not admin_user_id:
            return jsonify({'status': 'error', 'message': 'Admin not logged in.'}), 401

        query = """
            UPDATE courses 
            SET course_status = 'inactive',
                approved_by = %s,
                date_modified = %s
            WHERE course_id = %s
        """
        now = datetime.now()
        cursor.execute(query, (admin_user_id, now, course_id))
        db.commit()

        return jsonify({'status': 'success', 'message': 'Course rejected successfully.'})
    except Exception as e:
        db.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500