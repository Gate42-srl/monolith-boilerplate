import { LOCAL_ENVIRONMENT } from "../utils"

export let swaggerPath: string

if (LOCAL_ENVIRONMENT) swaggerPath = "/swagger/swaggerDocs.yaml"
else swaggerPath = "dist/swagger/swaggerDocs.yaml"
