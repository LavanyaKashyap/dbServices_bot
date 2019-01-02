
/**
 * This file contains the functionality to store the conversational data into mongodb.
 */
/*global
alert, confirm, console, prompt,require, module,const
jslint devel: true
esversion: 6
*/
/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//coremodules
//npm modules 
//others
var roomSessionMapperModel = require('../Models/SessionRoomMapperModel');
// var constant = require('../routes/constants');
// var util = require('./utility');
var storeRoomSessionMapperInfo = function(room_session_mapper,callback){

    var Container_session_mapper = roomSessionMapperModel.RoomSessionMapperObject(room_session_mapper);

    Container_session_mapper.save(function(err,savedRoomSessionMapper){
        if(err){
            console.log('ERROR WHILE SAVING MAPPING OF ROOM AND SESSION');
            callback(err,null);
        }else{
            console.log('MAPPING OF ROOM AND SESSION');
            console.log('SENDING.....');
            callback(null,savedRoomSessionMapper);
        }
    });
};

var updateRoomSessionMapperInfo = function(room_session_mapper , callback){
    console.log('UPDATE ROOM SESSION MAPPER INFO');
    var Container_session_mapper = roomSessionMapperModel.RoomSessionMapperObject;

    Container_session_mapper.update({_id : room_session_mapper.room_session_mapper_id},  { "$push": { "sessions": room_session_mapper.session_obj_id}},
        function (err, updatedmapper) {
            if (err) {
                console.log('INSIDE ERROR WHILE STORING SESSION DETAILS');
                callback(err, null);
            } else {
                console.log('INSIDE result FOR SESSION ');
                console.log(updatedmapper);
                callback(null, updatedmapper);

            }

       });


};

var doesMappingForRoomAlreadyexists = function(room_obj_id,callback){
console.log('INSIDE doesMappingForRoomAlreadyexists');
    var mapperObj = roomSessionMapperModel.RoomSessionMapperObject;

    mapperObj.findById({_id :room_obj_id } , function(err,RoomSessionmapperObj){
    if(err){
        callback(err,null);
    }else{
        callback(null,RoomSessionmapperObj);
    }
    });

};

var createMapperRoomSession = function(roomSessionMapperObj,callback){
    console.log('CREATE MAPPER OF ROOM AND SESSION');
    var outputJson = {};
    console.log(roomSessionMapperObj);
    var mapperObj = roomSessionMapperModel.RoomSessionMapperObject;
                console.log('STORE NEW MAPPER');
                storeRoomSessionMapperInfo( //map created session with room given in request
                    { Container_id: roomSessionMapperObj.container_obj_id, sessions: roomSessionMapperObj.session_obj_id }, function (mapperError, savedRoomSessionMapper) {
                        console.log('ERROR WHILE MAPPER OF SESSION AND ROOM' + mapperError);
                        console.log('NOT ERROR WHILE STORING SESSION AND ROOM MAPPER' + savedRoomSessionMapper);

                        if (mapperError) {
                            console.log('MAPPER ERROR ' + mapperError);
                            outputJson.message = mapperError;
                          callback(mapperError,null);
                        } else {
                            console.log('SESSION AND ROOM IS MAPPED');
                            callback(null,savedRoomSessionMapper);
                        }
                    });

};

var getRoomSessionUserMapper = function(session_obj_id,callback){

    console.log('GET SESSION FOR getSessionSessionObjectId');
    console.log('ROOM ID RECIEVED IS :'+session_obj_id);
    var sessionRoomMapper = roomSessionMapperModel.RoomSessionMapperObject;
    var outputJson = {};
    try {

    sessionRoomMapper.findOne({sessions :{ "$in" : [session_obj_id]}},'Container_id -_id' ).populate(
            {
                path: 'Container_id', select: 'Container_id Container_name -_id',
                populate: { path: 'user' , select: 'name image_url -_id'},
                
                
            }).
            exec(function(ErrorMapping , sessionRoomUserMapperObj){
                if(ErrorMapping){
                    console.log('ERROR : '  +ErrorMapping);
                    outputJson.message = ErrorMapping;
                    callback(ErrorMapping,null);
                    //return res.status(constant.InternalServerError).send(outputJson);
                }else{
                    console.log(sessionRoomUserMapperObj);
                    if (sessionRoomUserMapperObj === null || sessionRoomUserMapperObj === undefined || sessionRoomUserMapperObj === '') {
                        console.log('NOT MAPPING EXISTS');
                        callback('NO MAPPING EXISTS',null);
                        //return res.status(constant.BadRequest).send(outputJson);
                      
                    }else{
                        
                        console.log('MAPPING EXISTS' +sessionRoomUserMapperObj);
                        callback(null,sessionRoomUserMapperObj);
                        //return res.status(constant.OK).send(sessionRoomUserMapperObj);
                    }
                }
            });


    }catch(error){
        console.log('THERE IS A ERROR IN CATCH' + error);
        callback(error,null);
       // outputJson.message = error;
        //return res.status(constant.InternalServerError).send(outputJson);
    }

};




module.exports.createMapperRoomSession = createMapperRoomSession;
module.exports.getRoomSessionUserMapper = getRoomSessionUserMapper;
