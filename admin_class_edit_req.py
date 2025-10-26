from flask import Blueprint, render_template, request, jsonify, session, flash, url_for, redirect
from datetime import datetime
from database import get_db
import json

admin_class_edit_req_bp = Blueprint('admin_class_edit_req', __name__)

@admin_class_edit_req_bp.route('/class_edit_requests', methods=['GET'])
def view_class_edit_requests():
    if 'user_id' not in session or session.get('role') != 'admin':
        flash('You need to login as admin first', 'error')
        return redirect(url_for('login.login_page'))

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # --- Fetch class edit requests ---
        query = """
            SELECT 
                cl.class_id, cl.class_title, cl.schedule, cl.venue, cl.max_students,
                cl.start_date, cl.end_date, cl.status, cl.date_created, cl.date_updated,
                cl.edit_reason, cl.school_year, cl.batch, cl.instructor_name,
                co.course_title,
                pi.first_name, pi.last_name
            FROM classes cl
            JOIN courses co ON cl.course_id = co.course_id
            JOIN login l ON cl.instructor_id = l.user_id
            JOIN personal_information pi ON l.user_id = pi.user_id
            WHERE cl.status = 'edited'
            ORDER BY cl.date_updated DESC
        """
        cursor.execute(query)
        edit_requests = cursor.fetchall()

        for request in edit_requests:
            request['start_date'] = request['start_date'].strftime('%Y-%m-%d') if request['start_date'] else None
            request['end_date'] = request['end_date'].strftime('%Y-%m-%d') if request['end_date'] else None
            request['date_created'] = request['date_created'].strftime('%Y-%m-%d %H:%M') if request['date_created'] else None
            request['date_updated'] = request['date_updated'].strftime('%Y-%m-%d %H:%M') if request['date_updated'] else None

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

        cursor.close()

        return render_template(
            'admin/admin_class_edit_req.html',
            classes=edit_requests,
            profile_picture=profile_picture
        )

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500



@admin_class_edit_req_bp.route('/edit_approval_action', methods=['POST'])
def approve_or_reject_class_edit():
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()
        class_id = data.get('class_id')
        action = data.get('action')  

        if not class_id or action not in ['approve', 'reject']:
            return jsonify({'status': 'error', 'message': 'Invalid data provided.'}), 400

        new_status = 'active' if action == 'approve' else 'pending'
        now = datetime.now()

        update_query = """
            UPDATE classes
            SET status = %s, date_updated = %s
            WHERE class_id = %s
        """
        cursor.execute(update_query, (new_status, now, class_id))
        db.commit()

        return jsonify({'status': 'success', 'message': f'Class edit request has been {action}d.'})

    except Exception as e:
        db.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500