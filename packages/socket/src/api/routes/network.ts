import { apiFactory } from "@razzia/socket/api/factory"
import { requireManager } from "@razzia/socket/api/middleware"
import { getLanAddresses } from "@razzia/socket/services/network"

const routes = apiFactory
  .createApp()
  .use(requireManager)
  .get("/", (c) => c.json({ addresses: getLanAddresses() }))

export const network = routes
