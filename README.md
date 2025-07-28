# 🔍 Port Scanner

> **Network Security Tool** | **JavaScript** | **Node.js**

A powerful and efficient port scanner that automatically discovers devices and services on your local network. Perfect for security professionals, network administrators, and anyone who needs to locate and access network devices.

## ✨ Features

- 🔍 **Automatic Network Discovery** - Scans entire local network (192.168.1.x)
- 📡 **Multi-Protocol Support** - Detects HTTP, HTTPS, and various services
- ⚡ **Fast & Efficient** - Optimized scanning with timeout management
- 🎯 **Smart Detection** - Identifies actual device interfaces vs regular web servers
- 📊 **Detailed Reporting** - Shows all open ports and discovered devices
- 🛡️ **Safe & Legal** - Only scans your own network

## 🚀 Quick Start

### Prerequisites

- Node.js (v12 or higher)
- Network access to local subnet

### Installation

```bash
# Clone the repository
git clone https://github.com/SrPlugin/PortsScanner.git

# Navigate to project directory
cd PortsScanner

# Run the scanner
node portscanner.js
```

## 📋 Usage

### Basic Usage

```bash
node portscanner.js
```

### What it does:

1. **Scans** your local network (192.168.1.1 - 192.168.1.254)
2. **Tests** common service ports: 80, 443, 8080, 8000, 554, 1935, 9000, 37777, 37778, 37779
3. **Detects** HTTP/HTTPS device interfaces
4. **Reports** all findings with direct access URLs

### Sample Output

```
[*] Scanning local network for devices...
[*] Scanning devices on 192.168.1.100
[+] Port 443 open
[+] DEVICE FOUND! https://192.168.1.100:443

==================================================
SCAN RESULTS
==================================================
[+] Devices found:
   https://192.168.1.100:443
   http://192.168.1.150:8080

[+] All IPs and open ports:
   192.168.1.100: 443, 554
   192.168.1.150: 8080, 554
==================================================
```

## 🔧 Technical Details

### Scanned Ports

| Port        | Protocol | Purpose                 |
| ----------- | -------- | ----------------------- |
| 80          | HTTP     | Standard web interface  |
| 443         | HTTPS    | Secure web interface    |
| 8080        | HTTP     | Alternative web port    |
| 8000        | HTTP     | Alternative web port    |
| 554         | RTSP     | Video streaming         |
| 1935        | RTMP     | Real-time messaging     |
| 9000        | HTTP     | Custom web port         |
| 37777-37779 | HTTP     | Device management ports |

### Network Range

- **Base Network**: 192.168.1.x
- **Scan Range**: 192.168.1.1 - 192.168.1.254
- **Total IPs**: 254 addresses

## 🛡️ Security & Legal Notice

⚠️ **Important**: This tool is designed for:

- ✅ Scanning your own network
- ✅ Security testing with permission
- ✅ Network administration
- ✅ Educational purposes

❌ **Do NOT use for**:

- Unauthorized network scanning
- Accessing devices without permission
- Any illegal activities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Node.js native modules
- Inspired by network security tools
- Designed for educational and legitimate security testing

---

**Made with ❤️ SrPlugin for the security community**

---

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Review the code comments

**Happy Scanning! 🔍**
