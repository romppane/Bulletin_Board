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

router.get('/:id', (req, res) => {
  const reply : Reply = replies[req.params.id];
  res.status(200).send(reply);
})

router.post('/', (req, res) => {
  const reply : Reply = new Reply(req.body.id, req.body.user_id, req.body.post_id, req.body.message);
  replies.push(reply);
  res.status(201).send(reply);
})

router.delete('/:id', (req, res) => {
  const deleted = replies[req.params.id];
  replies.splice(req.params.id, 1);
  res.status(202).send(deleted);
})

router.put('/:id', (req, res) => {
  const updated : Reply = replies[req.params.id];
  if(req.body.message) {
    updated.setMessage(req.body.message);
  }
  replies[req.params.id] = updated;
  res.status(200).send(updated);
})

//Add and delete likes
router.patch('/:id/like', (req,res) => {
  const updated : Reply = replies[req.params.id];
  updated.likeReply();
  res.status(200).send(updated);
})

router.delete('/:id/like', (req,res) => {
  const updated : Reply = replies[req.params.id];
  updated.unlikeReply();
  res.status(200).send(updated);
})
module.exports = router;
