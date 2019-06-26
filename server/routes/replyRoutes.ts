import express = require('express');
const router = express.Router();
import {Reply} from '../entities/reply';

let replies: Reply[] = [];

for(let i = 0; i<5; i++) {
  replies.push(new Reply(i, i, i, "#"+i));
}

router.get('/', (req, res) => {
  res.status(200).send(replies);
})
module.exports = router;
