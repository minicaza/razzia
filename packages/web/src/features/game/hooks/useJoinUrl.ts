import { networkQuery } from "@razzia/web/features/game/queries"
import { useQuery } from "@tanstack/react-query"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"])

/**
 * Base URL players should open to join. When the manager browses through
 * `localhost` the QR would only work on this machine, so the host is swapped
 * for the server's LAN address (same protocol and port).
 */
export const useJoinUrl = () => {
  const { origin, hostname, protocol, port } = window.location
  const isLoopback = LOOPBACK_HOSTS.has(hostname)
  const { data } = useQuery({ ...networkQuery(), enabled: isLoopback })
  const address = data?.addresses[0]

  if (!isLoopback || !address) {
    return origin
  }

  return `${protocol}//${address}${port ? `:${port}` : ""}`
}
