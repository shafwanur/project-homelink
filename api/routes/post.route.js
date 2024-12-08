import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
    console.log("The router works!");
}) 
router.post("/test", (req, res) => {
    console.log("The router works!");
}) 
router.put("/test", (req, res) => {
    console.log("The router works!");
}) 
router.delete("/test", (req, res) => {
    console.log("The router works!");
}) 

export default router;