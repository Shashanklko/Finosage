import smtplib
import socket

def test_smtp():
    host = "smtp.gmail.com"
    port = 587
    print(f"Testing connection to {host}:{port}...")
    try:
        server = smtplib.SMTP(host, port, timeout=10)
        print("Successfully connected to SMTP server.")
        server.starttls()
        print("Successfully started TLS.")
        server.quit()
    except Exception as e:
        print(f"Failed to connect: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    test_smtp()
