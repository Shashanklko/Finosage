import socket

def check_dns():
    host = "smtp.gmail.com"
    try:
        infos = socket.getaddrinfo(host, 587)
        for info in infos:
            family, type, proto, canonname, sockaddr = info
            ip = sockaddr[0]
            fam_str = "IPv4" if family == socket.AF_INET else "IPv6"
            print(f"Resolved {host} to {ip} ({fam_str})")
            
            # Try to connect
            try:
                s = socket.socket(family, socket.SOCK_STREAM)
                s.settimeout(5)
                s.connect((ip, 587))
                print(f"  Connect to {ip}:587: SUCCESS")
                s.close()
            except Exception as e:
                print(f"  Connect to {ip}:587: FAILED - {e}")
    except Exception as e:
        print(f"DNS resolution failed: {e}")

if __name__ == "__main__":
    check_dns()
