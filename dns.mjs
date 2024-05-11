import fs from "fs/promises"

const dnsLan = await fs.readFile("./dns-lan", "utf-8")

const lines = dnsLan.split("\n")
    .filter(e => e.length)
    .filter(e => !/^\s+$/.test(e))
    .filter(e => !/^\s*#/.test(e))

const addresses = {}

for (let line of lines) {
    const parts = line.split(" ")
    const destination = parts[0]
    const hosts = parts.slice(1)
    console.log(destination, hosts)

    for (let host of hosts) {
        addresses[host] = destination
    }
}

function checkAddresses() {
    for (let [host, dest] of Object.entries(addresses)) {
        if (addresses[dest]) {
            return true
        }
    }

    return false
}

while (checkAddresses()) {
    for (let [host, dest] of Object.entries(addresses)) {
        if (addresses[dest]) {
            addresses[host] = addresses[dest]
        }
    }
}

const output = Object.entries(addresses).map((v) => v[0] + " " + v[1]).join("\n")

console.log(output)

await fs.writeFile("sys/dns-lan", output)