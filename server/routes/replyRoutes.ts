import express = require('express');
const router = express.Router();
import {Reply} from '../entities/reply';
import { getRepository } from 'typeorm';


router.get('/', async (req, res) => {
  try {
    const replies = await getRepository(Reply).find();
    res.status(200).send(replies);
  } catch (error) {
    console.log(error);
    // Internal error
    res.send(error);
  }
  
})

router.get('/:id', async (req, res) => {
  try {
    const reply = await getRepository(Reply).findOne(req.params.id);
    if(reply) {
      res.status(200).send(reply);
    }
    else {
      res.status(404).send({message : "User not found!"})
    }
  } catch (error) {
    console.log(error);
    // in case of an internal error
    res.send(error);
  }
  
})

router.post('/', async (req, res) => {
  try {
    const reply : Reply = new Reply(req.body.user_id, req.body.post_id, req.body.message);
    await getRepository(Reply).save(reply);
    res.status(201).send(reply);
  } catch (error) {
    // Could be a user error or internal, find out the possibilities and design messages
    console.log(error);
    res.send(error);
  }
  
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await getRepository(Reply).delete(req.params.id);
  if(deleted.affected) {
    res.sendStatus(204);
  }
  else {
    res.status(404).send({Affected : deleted.affected});
  }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  
})

router.put('/:id', async (req, res) => {

  try {
    // Validate out any unnecessary fields
    await getRepository(Reply).update(req.params.id, req.body);
    const updated = await getRepository(Reply).findOne(req.params.id);
    if(updated) {
    
      res.status(200).send(updated);
    }
    else {
      res.status(404).send({
        message : "User not found"
      })
    }
  
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  
  

})

//Add and delete likes
/*
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
*/
module.exports = router;
