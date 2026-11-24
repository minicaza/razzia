import os from "os"

/** Interfaces created by containers, hypervisors and VPNs: they are not reachable from the players' devices. */
const VIRTUAL_INTERFACE = /^(docker|br-|veth|virbr|vmnet|vboxnet|utun|tun|tap)/i

/** IPv4 addresses of this machine on the local network, physical interfaces first in OS order. */
export const getLanAddresses = (
  interfaces: ReturnType<typeof os.networkInterfaces> = os.networkInterfaces(),
): string[] =>
  Object.entries(interfaces)
    .filter(([name]) => !VIRTUAL_INTERFACE.test(name))
    .flatMap(([, infos = []]) => infos)
    .filter((info) => info.family === "IPv4" && !info.internal)
    .map((info) => info.address)
