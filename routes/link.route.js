import { Router} from "express"; 
import { createLink, getLink, getLinks, removeLink, updateLink } from "../controllers/link.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyLinkValidator, paramLinkValidator } from "../middlewares/validatorManager.js";
const router = Router()

// get      /api/v1/links         all links
// get      /api/v1/links/:id     single link
// post     /api/v1/links         create link
// patch    /api/v1/links/:id     update link (patch y no put porque esta destinado a modoficar no todo el objeto.) 
// delete   /api/v1/links/:id     remove link

router.get("/", requireToken, getLinks)  //al getLinks le llega el req.uid y por eso lo puedo usar ahi gracias a que uso el middleware requireToken
router.get("/:nanoLink", getLink)
router.post("/", requireToken, bodyLinkValidator, createLink)
router.delete("/:id", requireToken, paramLinkValidator, removeLink)
router.patch("/:id", requireToken, paramLinkValidator, bodyLinkValidator, updateLink)

export default router

