# Ralph Ngirazi - Personal Portfolio

A modern, responsive portfolio web application built with **Flask**, **HTML5**, and **CSS3**.

---

## 🚀 Features

- **Flask Backend (`app.py`)**: Lightweight Python web server with template rendering and contact form processing.
- **Direct Email Delivery**: Contact form submissions are processed by Flask and sent directly to `ralphngirazi@gmail.com` using Python's `smtplib`.
- **Pure HTML & CSS Responsive Navigation**: Sleek fixed header that stays collapsed in its default state on mobile until tapped, and automatically closes upon clicking any section link.
- **Cross-Device Responsive Design**: Fully responsive across mobile screens (`320px`+), tablets, and desktops with zero horizontal overflow.

---

## 📂 Project Structure

```
Potfolio/
│
├── app.py                 # Flask application & contact form route
├── requirements.txt       # Python dependencies (Flask, python-dotenv)
├── .env.example           # Example environment variables (SMTP settings)
├── .gitignore             # Git ignore file for Python cache & logs
│
├── templates/
│   └── index.html         # Jinja2 template for Flask
│
├── static/
│   ├── style.css          # Modern dark-theme stylesheet
│   ├── profilepicture.jpg # Profile image
│   ├── project1.jpg       # Project thumbnail 1
│   ├── project2.jpg       # Project thumbnail 2
│   └── project3.jpg       # Project thumbnail 3
│
└── index.html             # Static version for GitHub Pages deployment
```

---

## 💻 How to Run Locally with Flask

1. **Clone the repository:**
   ```bash
   git clone https://github.com/r25308c-ralph/PortifolioWebsite.git
   cd PortifolioWebsite
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

4. **Open in browser:**
   - On your computer: `http://127.0.0.1:5000`
   - **On your phone (connected to same Wi-Fi):** `http://<YOUR_COMPUTER_LOCAL_IP>:5000`

---

## 📧 Email Configuration (Optional SMTP)

By default, form submissions are logged safely on the server. To enable live SMTP email sending:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your Gmail App Password in `.env`:
   ```env
   RECIPIENT_EMAIL=ralphngirazi@gmail.com
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

---

## 🌐 Live GitHub Pages Demo

You can also view the static deployment directly on your phone:
👉 **[https://r25308c-ralph.github.io/PortifolioWebsite/](https://r25308c-ralph.github.io/PortifolioWebsite/)**
