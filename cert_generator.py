import os
import hashlib
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import qrcode
import io
from database import get_db


CERT_DIR = "static/certs"
os.makedirs(CERT_DIR, exist_ok=True)

def create_certificate(organization_name, organization_address, competency, accreditation_no,
                       date_accredited, expiration_date, filename, tx_hash=None, cert_hash=None):
    """TESDA-style Certificate of Accreditation"""
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    left_margin = 1 * inch
    right_margin = width - 1 * inch
    top_margin = height - 1.9 * inch
    line_spacing = 7 * mm

    # Draw border box
    c.setStrokeColor(colors.black)
    c.setLineWidth(1)
    c.rect(left_margin, 1 * inch, width - 2 * inch, height - 2 * inch)

    # --- TESDA Logo ---
    logo_path = os.path.join("static", "img", "tesda_logo.png")
    if os.path.exists(logo_path):
        logo_width = 70
        logo_height = 70
        c.drawImage(
            logo_path,
            width / 2 - (logo_width / 2),
            top_margin - logo_height + 30,
            width=logo_width,
            height=logo_height,
            preserveAspectRatio=True,
            mask="auto",
        )
    else:
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(width / 2, top_margin, "[TESDA LOGO]")

    # --- Header Text ---
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, top_margin - 1.0 * inch,
                        "TECHNICAL EDUCATION AND SKILLS DEVELOPMENT AUTHORITY")

    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, top_margin - 1.8 * inch,
                        "CERTIFICATE OF ACCREDITATION")

    current_y = top_margin - 2.5 * inch

    # --- Body Content ---
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, current_y, "This is to certify that")
    current_y -= line_spacing * 2.5

    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, current_y, organization_name.upper())
    current_y -= line_spacing * 3.5

    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(width / 2, current_y, organization_address.upper())
    current_y -= line_spacing * 1

    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, current_y, "is an Accredited Competency Assessment Center for")
    current_y -= line_spacing * 2.5

    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, current_y, competency.upper())
    current_y -= line_spacing * 2

    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, current_y, f"Accreditation No.: {accreditation_no}")
    current_y -= line_spacing * 2
    
    c.setFont("Helvetica", 12)
    c.drawString(left_margin + 0.5 * inch, current_y, f"Date Accredited: {date_accredited}")

    c.drawString(width/2 + 0.3 * inch, current_y, f"Expiration Date: {expiration_date}")

    current_y -= line_spacing * 3.5


    # --- Signature Block ---
    c.setFont("Helvetica", 12)
    c.drawString(left_margin + 1.5 * inch, current_y, "Approved by:")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(left_margin + 2.8 * inch, current_y, "DORIE U. GUTIERREZ")

    current_y -= line_spacing  # move down for the next line


    c.setFont("Helvetica", 12)
    c.drawString(left_margin + 2.8 * inch, current_y,
                 "Acting Regional Director, TESDA Region IV-A")
    

    if cert_hash and tx_hash:
        c.setFont("Helvetica", 8)
        c.drawCentredString(width / 2.4, 0.7 * inch, f"Certificate Hash: {cert_hash}")
        c.drawCentredString(width / 2.3, 0.5 * inch, f"Blockchain TX Hash: {tx_hash}")

    c.showPage()

    # --- PAGE 2: QR Code + Verification ---
    if cert_hash:
        qr_url = f"http://192.168.100.162:5002/verify?tx={tx_hash}"
        qr = qrcode.QRCode(box_size=10, border=2)
        qr.add_data(qr_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="PNG")
        img_buffer.seek(0)

        c.drawImage(ImageReader(img_buffer), width/2 - 100, height/2 - 100, width=200, height=200)
        c.setFont("Helvetica", 14)
        c.drawCentredString(width/2, height/2 - 120, "Scan this QR to verify certificate")
        c.showPage()

    c.save()


def get_certificate_hash(filename):
    """Generate SHA-256 hash of file"""
    with open(filename, "rb") as f:
        file_content = f.read()
    raw_hash = hashlib.sha256(file_content).hexdigest()
    raw_hash = raw_hash[:64]
    if len(raw_hash) != 64:
        raise ValueError("Hash length invalid")

    return {
        "raw": "0x" + str(raw_hash),
        "org": "LSEF" + str(raw_hash)
    }


def register_certificate(organization_name, competency, cert_hash):
    """Mock blockchain registration"""
    return hashlib.md5(f"{organization_name}{competency}{cert_hash}".encode()).hexdigest()


def save_certificate(enrollment_id, name, course, date, cert_hash, tx_hash, file_path):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO certificates (enrollment_id, name, course, date, cert_hash, tx_hash, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (enrollment_id, name, course, date, cert_hash, tx_hash, file_path))
        conn.commit()
        cursor.close()
        print("✅ Certificate saved successfully")
    except Exception as e:
        print("❌ DB Error:", e)

