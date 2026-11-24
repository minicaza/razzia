import { getLanAddresses } from "@razzia/socket/services/network"
import type os from "os"
import { describe, expect, it } from "vitest"

type Interfaces = ReturnType<typeof os.networkInterfaces>

const info = (address: string, family: "IPv4" | "IPv6", internal = false) =>
  ({ address, family, internal }) as os.NetworkInterfaceInfo

describe("getLanAddresses", () => {
  it("keeps only external IPv4 addresses", () => {
    const interfaces: Interfaces = {
      lo0: [info("127.0.0.1", "IPv4", true)],
      en0: [info("fe80::1", "IPv6"), info("10.97.154.158", "IPv4")],
    }

    expect(getLanAddresses(interfaces)).toEqual(["10.97.154.158"])
  })

  it("skips container, hypervisor and VPN interfaces", () => {
    const interfaces: Interfaces = {
      docker0: [info("172.17.0.1", "IPv4")],
      "br-1a2b3c": [info("172.18.0.1", "IPv4")],
      utun3: [info("100.64.0.2", "IPv4")],
      wlan0: [info("192.168.1.20", "IPv4")],
    }

    expect(getLanAddresses(interfaces)).toEqual(["192.168.1.20"])
  })

  it("returns an empty list when there is no network", () => {
    expect(getLanAddresses({ lo0: [info("127.0.0.1", "IPv4", true)] })).toEqual(
      [],
    )
  })
})
