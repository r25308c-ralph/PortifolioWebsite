import os
import smtplib
from email.message import EmailMessage
from datetime import datetime
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify

app = Flask(__name__)
# Secret key for flash messages and session security
app.secret_key = os.environ.get('SECRET_KEY', 'ralph-portfolio-secret-key-2026')

# Configuration for Email Sending
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'ralphngirazi@gmail.com')
MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')


def send_contact_email(name, sender_email, subject, message):
    """
    Sends contact form email directly to Ralph using Python's smtplib.
    If SMTP credentials are not yet configured in environment variables,
    it saves the message to messages.log so no inquiries are ever lost.
    """
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # If SMTP credentials are provided, send live email via SMTP
    if MAIL_USERNAME and MAIL_PASSWORD:
        msg = EmailMessage()
        msg['Subject'] = f"[Portfolio Contact] {subject} (from {name})"
        msg['From'] = MAIL_USERNAME
        msg['To'] = RECIPIENT_EMAIL
        msg['Reply-To'] = sender_email

        body = (
            f"You received a new message from your portfolio contact form:\n\n"
            f"Date: {timestamp}\n"
            f"Sender Name: {name}\n"
            f"Sender Email: {sender_email}\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message}\n"
        )
        msg.set_content(body)

        with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
            server.starttls()
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            server.send_message(msg)
        return True, "Email sent successfully via SMTP."
    else:
        # Fallback: log to messages.log when running locally without SMTP setup
        log_entry = (
            f"[{timestamp}] New Message from {name} <{sender_email}>\n"
            f"Subject: {subject}\n"
            f"Message: {message}\n"
            f"{'-'*50}\n"
        )
        with open('messages.log', 'a', encoding='utf-8') as f:
            f.write(log_entry)
        return True, "Message logged successfully (SMTP credentials optional)."


@app.route('/')
def index():
    """Renders the main portfolio page."""
    return render_template('index.html')


@app.route('/contact', methods=['POST'])
def contact():
    """Handles contact form submissions."""
    # Handle both standard HTML form and AJAX requests
    if request.is_json:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
    else:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

    if not name or not email or not subject or not message:
        if request.is_json:
            return jsonify({'success': False, 'message': 'Please fill in all fields.'}), 400
        flash('Please fill in all required fields.', 'error')
        return redirect(url_for('index', _anchor='contact'))

    try:
        success, info = send_contact_email(name, email, subject, message)
        success_msg = f"Thank you, {name}! Your message has been sent directly to Ralph."

        if request.is_json:
            return jsonify({'success': True, 'message': success_msg}), 200

        flash(success_msg, 'success')
        return redirect(url_for('index', _anchor='contact'))
    except Exception as e:
        err_msg = f"Failed to send message: {str(e)}"
        if request.is_json:
            return jsonify({'success': False, 'message': err_msg}), 500
        flash('Sorry, there was an issue sending your message. Please try emailing directly.', 'error')
        return redirect(url_for('index', _anchor='contact'))


if __name__ == '__main__':
    # host='0.0.0.0' allows accessing the Flask portfolio on your phone
    # when connected to the same Wi-Fi network (http://<computer-ip>:5000)
    print("Starting Flask Portfolio Server...")
    print("Access locally at http://127.0.0.1:5000")
    print("Access from phone on same Wi-Fi at http://<your-local-ip>:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
