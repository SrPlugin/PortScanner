import net from 'net';
import http from 'http';
import https from 'https';

// Common device ports
const cameraPorts: number[] = [80, 443, 8080, 8000, 554, 1935, 9000, 37777, 37778, 37779];

/**
 * Scans a specific port on an IP address
 * @param {string} ip - The IP address to scan
 * @param {number} port - The port number to check
 * @returns {Promise<boolean>} - True if port is open, false otherwise
 */
const scanPort = (ip: string, port: number): Promise<boolean> => {
    return new Promise<boolean>((resolve: (value: boolean) => void): void => {
        const socket: net.Socket = new net.Socket();
        socket.setTimeout(1000);

        socket.on('connect', (): void => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', (): void => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (): void => {
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, ip);
    });
};

/**
 * Checks if an IP:port responds to HTTP/HTTPS requests
 * @param {string} ip - The IP address to check
 * @param {number} port - The port number to check
 * @param {boolean} isHttps - Whether to use HTTPS or HTTP
 * @returns {Promise<boolean>} - True if responds with 200 OK
 */

const checkHttpResponse = (ip: string, port: number, isHttps: boolean = false): Promise<boolean> => {
    return new Promise<boolean>((resolve: (value: boolean) => void): void => {
        const protocol: typeof http | typeof https = isHttps ? https : http;
        const url: string = `${isHttps ? 'https' : 'http'}://${ip}:${port}`;

        const req: http.ClientRequest = protocol.get(url, { timeout: 3000 }, (res: http.IncomingMessage): void => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', (): void => resolve(false));
        req.on('timeout', (): void => {
            req.destroy();
            resolve(false);
        });
    });
};

/**
 * Scans an IP address for open device ports and checks for web interfaces
 * @param {string} ip - The IP address to scan
 * @returns {Promise<Object>} - Object containing found devices and open ports
 */

const scanCameraPorts = async (ip: string): Promise<{ foundDevices: string[]; openPorts: number[] }> => {
    console.log(`[*] Scanning devices on ${ip}`);
    const foundDevices: string[] = [];
    const openPorts: number[] = [];

    for (const port of cameraPorts) {
        const isOpen: boolean = await scanPort(ip, port);

        if (isOpen) {
            console.log(`[+] Port ${port} open`);
            openPorts.push(port);

            const httpWorks: boolean = await checkHttpResponse(ip, port, false);
            if (httpWorks) {
                const url: string = `http://${ip}:${port}`;
                console.log(`[+] DEVICE FOUND! ${url}`);
                foundDevices.push(url);
                continue;
            }

            const httpsWorks: boolean = await checkHttpResponse(ip, port, true);
            if (httpsWorks) {
                const url: string = `https://${ip}:${port}`;
                console.log(`[+] DEVICE FOUND! ${url}`);
                foundDevices.push(url);
            }
        }
    }

    return { foundDevices, openPorts };
};


/**
 * Scans the entire local network for devices
 * Scans range 192.168.1.1 to 192.168.1.254
 * @returns {Promise<void>}
 */

const scanNetwork = async (): Promise<void> => {
    const baseIp: string = "192.168.1";
    const allDevices: string[] = [];
    const allOpenPorts: Record<string, number[]> = {};

    console.log("[*] Scanning local network for devices...");

    for (let i: number = 1; i <= 254; i++) {
        const ip: string = `${baseIp}.${i}`;
        const { foundDevices, openPorts }: { foundDevices: string[]; openPorts: number[] } = await scanCameraPorts(ip);

        if (foundDevices.length > 0) {
            allDevices.push(...foundDevices);
        }

        if (openPorts.length > 0) {
            allOpenPorts[ip] = openPorts;
        }
    }

    // Show results
    console.log("\n" + "=".repeat(50));
    console.log("SCAN RESULTS");
    console.log("=".repeat(50));

    if (allDevices.length > 0) {
        console.log(`\n[+] Devices found:`);
        allDevices.forEach((device: string): void => {
            console.log(`   ${device}`);
        });
        console.log("\nOpen these links in your browser to access the devices");
    } else {
        console.log("\n[-] No devices found on the network");
    }

    if (Object.keys(allOpenPorts).length > 0) {
        console.log(`\n[+] All IPs and open ports:`);
        Object.entries(allOpenPorts).forEach(([ip, ports]: [string, number[]]): void => {
            console.log(`   ${ip}: ${ports.join(', ')}`);
        });
    }

    console.log("\n" + "=".repeat(50));
};

// Run the scan
scanNetwork().catch(console.error);
