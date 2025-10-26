from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
import qrcode
import io
import os
import math
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

# Register Chinese font
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

# Register Old English font
pdfmetrics.registerFont(TTFont("OldEnglishText", "static/certs/UnifrakturCook-Bold.ttf"))

def draw_curved_text(c, text, fontname, fontsize, center_x, center_y, radius_x, radius_y, arc_angle=30, upward=True, letter_spacing=1.0):
    """
    Draws text curved along an elliptical arc.
    """
    c.setFont(fontname, fontsize)
    angle_per_char = (arc_angle / len(text)) * letter_spacing
    start_angle = -((len(text) - 1) * angle_per_char) / 2
    angle = start_angle

    for ch in text:
        rad = math.radians(angle)
        if upward:
            x = center_x + radius_x * math.sin(rad)
            y = center_y + radius_y * math.cos(rad)
            rotation = -angle
        else:
            x = center_x + radius_x * math.sin(rad)
            y = center_y - radius_y * math.cos(rad)
            rotation = angle

        c.saveState()
        c.translate(x, y)
        c.rotate(rotation)
        c.drawCentredString(0, 0, ch)
        c.restoreState()
        angle += angle_per_char

def create_completion_certificate(recipient_name, output_filename, tx_hash=None, cert_hash=None):
    page_width, page_height = landscape(letter)
    c = canvas.Canvas(output_filename, pagesize=landscape(letter))
    margin = 0.5 * inch
    border_width = page_width - 2 * margin
    border_height = page_height - 2 * margin

    def draw_centered_text(text, fontname, fontsize, x, y, color=colors.black):
        c.setFont(fontname, fontsize)
        c.setFillColor(color)
        c.drawCentredString(x, y, text)
        c.setFillColor(colors.black)

    center_x = page_width / 2

    # -------- PAGE 1: Certificate --------
    # Outer bulky border
    c.setStrokeColor(colors.red)
    c.setLineWidth(25)
    c.rect(margin, margin, border_width, border_height)

    # Inner thin border
    inset = 20
    c.setLineWidth(2)
    c.setStrokeColor(colors.red)
    c.rect(margin + inset, margin + inset, border_width - 2*inset, border_height - 2*inset)

    # Logo with white ellipse background
    logo_path = "static/img/lsef_logo.png"
    if os.path.exists(logo_path):
        logo_width = 120
        logo_height = 100
        bg_width = 100
        bg_height = 90

        logo_x = center_x - (logo_width / 2)
        logo_y = page_height - margin - 67

        bg_x = center_x
        bg_y = logo_y + (logo_height / 2)

        c.setFillColor(colors.white)
        c.setStrokeColor(colors.white)
        c.ellipse(
            bg_x - (bg_width / 2), bg_y - (bg_height / 2),
            bg_x + (bg_width / 2), bg_y + (bg_height / 2),
            fill=1, stroke=0
        )

        logo = ImageReader(logo_path)
        c.drawImage(logo, logo_x, logo_y, width=logo_width, height=logo_height, mask='auto')

    # Header
    draw_centered_text("菲津富内湖中華學校", "STSong-Light", 30, center_x, page_height - margin - 90, color=colors.darkred)
    draw_centered_text("Laguna Sino-Filipino Educational Foundation Inc.", "Helvetica-Bold", 25, center_x, page_height - margin - 120)
    draw_centered_text("F. Sario St. Santa Cruz, Laguna", "Helvetica", 18, center_x, page_height - margin - 148)

    c.setLineWidth(1)
    c.setStrokeColor(colors.black)

    # Title (curved)
    draw_curved_text(
        c,
        "Certificate of Completion",
        "OldEnglishText",
        60,
        center_x,
        page_height - margin - 420,
        radius_x=520,
        radius_y=200,
        arc_angle=60,
        upward=True,
        letter_spacing=1.2
    )

    # Subtitle & Recipient
    draw_centered_text("This certificate is proudly awarded to", "Helvetica", 18, center_x, page_height - margin - 295)
    draw_centered_text(recipient_name, "OldEnglishText", 50, center_x, page_height - margin - 368)
    c.line(center_x - 200, page_height - margin - 370, center_x + 200, page_height - margin - 370)

    draw_centered_text("In recognition of your dedication,", "Helvetica", 18, center_x, page_height - margin - 405)
    draw_centered_text("passion and hardwork during your training.", "Helvetica", 18, center_x, page_height - margin - 425)

    # Signatories
    sign_y = page_height - margin - 500
    c.line(margin + 85, sign_y + 20, margin + 265, sign_y + 20)
    draw_centered_text("Nenica G. Avenido", "Helvetica-Bold", 18, margin + 175, sign_y + 25)
    draw_centered_text("Trainor", "Helvetica", 15, margin + 175, sign_y + 3)

    c.line(page_width - margin - 265, sign_y + 20, page_width - margin - 85, sign_y + 20)
    draw_centered_text("Enrico Ariel T. Ting", "Helvetica-Bold", 18, page_width - margin - 175, sign_y + 25)
    draw_centered_text("Chairman, BOT", "Helvetica", 15, page_width - margin - 175, sign_y + 3)

    # --- Add hashes at the very bottom ---
    if cert_hash:
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.black)
        c.drawCentredString(center_x, margin - 10, f"Certificate Hash: {cert_hash}")
    if tx_hash:
        c.setFont("Helvetica", 10)
        c.drawCentredString(center_x, margin - 25, f"Blockchain TX Hash: {tx_hash}")

    # Finish Page 1
    c.showPage()

    # -------- PAGE 2: QR Code --------
    if cert_hash:
        qr_url = f"http://192.168.100.162:5002/verify?tx={tx_hash}"
        qr = qrcode.QRCode(box_size=10, border=2)
        qr.add_data(qr_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        c.drawImage(ImageReader(img_buffer), center_x - 100, page_height/2 - 100, width=200, height=200)
        draw_centered_text("Scan this QR to verify certificate", "Helvetica", 14, center_x, page_height/2 - 120)

    # Save PDF
    c.showPage()
    c.save()


if __name__ == "__main__":
    recipient_name = "Juan Dela Cruz"
    output_filename = "completion_certificate.pdf"

    tx_hash = "sample123456789"
    cert_hash = "abcdef123456"

    create_completion_certificate(recipient_name, output_filename, tx_hash, cert_hash)
    print(f"✅ Certificate generated: {output_filename}")
