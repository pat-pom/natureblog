const router = require('express').Router();


router.get('/', (req,res) => {
    res.json({
        posts: {
            title: 'moj pierwszy post',
            opis: 'dzis bylem nad woda'
        }
    })
})


module.exports = router;
