const express = require("express");
const router = express.Router();

router.get('/', (req, res)=>{
    obj = {
        Name: "UTKARSH YADAV",
        AGE: 18
    };
    res.json(obj);
});

module.exports = router;