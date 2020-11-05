import bodyParser from 'body-parser';
import Router from 'express-promise-router';
import * as administrationController from '~/controllers/bbb/administration.controller';

const administrationRouter = Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const route = '/administration';

administrationRouter.post(`${route}/create`, urlencodedParser, administrationController.create);
administrationRouter.post(`${route}/join`, urlencodedParser, administrationController.join);
administrationRouter.post(`${route}/end`, urlencodedParser, administrationController.endPost);
administrationRouter.delete(`${route}/end`, administrationController.endDel);
administrationRouter.get(route, administrationController.get);

export default administrationRouter;

/**
 * @swagger
 * tags:
 *  - name: administration
 *    description: administration calls
 */

/**
 * @swagger
 *
 * /administration/create:
 *  post:
 *    summary: Create meeting room
 *    tags:
 *    - administration
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - meetingName
 *            properties:
 *              meetingName:
 *                type: string
 *                description: A name for the meeting.
 *              attendeePW:
 *                type: string
 *                description: The password that the join URL can later provide as its password parameter to indicate the user will join as a viewer. If no attendeePW is provided, the create call will return a randomly generated attendeePW password for the meeting.
 *              moderatorPW:
 *                type: string
 *                description: The password that will join URL can later provide as its password parameter to indicate the user will as a moderator. if no moderatorPW is provided, create will return a randomly generated moderatorPW password for the meeting.
 *              welcome:
 *                type: string
 *                description: A welcome message that gets displayed on the chat window when the participant joins. You can include keywords (%%CONFNAME%%, %%DIALNUM%%, %%CONFNUM%%) which will be substituted automatically. This parameter overrides the default defaultWelcomeMessage in bigbluebutton.properties. The welcome message has limited support for HTML formatting. Be careful about copy/pasted HTML from e.g. MS Word, as it can easily exceed the maximum supported URL length when used on a GET request.
 *              dialNumber:
 *                type: string
 *                description: The dial access number that participants can call in using regular phone. You can set a default dial number via defaultDialAccessNumber in bigbluebutton.properties
 *              voiceBridge:
 *                type: string
 *                description: Voice conference number for the FreeSWITCH voice conference associated with this meeting. This must be a 5-digit number in the range 10000 to 99999. If you add a phone number to your BigBlueButton server, This parameter sets the personal identification number (PIN) that FreeSWITCH will prompt for a phone-only user to enter. If you want to change this range, edit FreeSWITCH dialplan and defaultNumDigitsForTelVoice of bigbluebutton.properties. The voiceBridge number must be different for every meeting. This parameter is optional. If you do not specify a voiceBridge number, then BigBlueButton will assign a random unused number for the meeting.
 *              maxParticipants:
 *                type: number
 *                description: Set the maximum number of users allowed to joined the conference at the same time.
 *              logoutURL:
 *                type: string
 *                description: The URL that the BigBlueButton client will go to after users click the OK button on the ‘You have been logged out message’. This overrides the value for bigbluebutton.web.logoutURL in bigbluebutton.properties.
 *              record:
 *                type: boolean
 *                description: Setting ‘record=true’ instructs the BigBlueButton server to record the media and events in the session for later playback. The default is false.
 *              duration:
 *                type: number
 *                description: The maximum length (in minutes) for the meeting. Normally, the BigBlueButton server will end the meeting when either (a) the last person leaves (it takes a minute or two for the server to clear the meeting from memory) or when the server receives an end API request with the associated meetingID (everyone is kicked and the meeting is immediately cleared from memory).
 *              isBreakout:
 *                type: boolean
 *                description: Must be set to true to create a breakout room.
 *              parentMeetingID:
 *                type: string
 *                description: Must be provided when creating a breakout room, the parent room must be running.
 *              sequence:
 *                type: number
 *                description: The sequence number of the breakout room.
 *              freeJoin:
 *                type: boolean
 *                description: If set to true, the client will give the user the choice to choose the breakout rooms he wants to join.
 *              meta:
 *                type: string
 *                description: This is a special parameter type (there is no parameter named just meta). You can pass one or more metadata values when creating a meeting. These will be stored by BigBlueButton can be retrieved later via the getMeetingInfo and getRecordings calls.
 *              moderatorOnlyMessage:
 *                type: string
 *                description: Display a message to all moderators in the public chat. The value is interpreted in the same way as the welcome parameter.
 *              autoStartRecording:
 *                type: boolean
 *                description: Whether to automatically start recording when first user joins (default false). When this parameter is true, the recording UI in BigBlueButton will be initially active. Moderators in the session can still pause and restart recording using the UI control. Don’t pass autoStartRecording=false and allowStartStopRecording=false - the moderator won’t be able to start recording!
 *              allowStartStopRecording:
 *                type: boolean
 *                description: Allow the user to start/stop recording. (default true) If you set both allowStartStopRecording=false and autoStartRecording=true, then the entire length of the session will be recorded, and the moderators in the session will not be able to pause/resume the recording.
 *              webcamsOnlyForModerator:
 *                type: boolean
 *                description: Setting webcamsOnlyForModerator=true will cause all webcams shared by viewers during this meeting to only appear for moderators
 *              logo:
 *                type: string
 *                description: Setting logo=http://www.example.com/my-custom-logo.png will replace the default logo in the Flash client.
 *              bannerText:
 *                type: string
 *                description: Will set the banner text in the client. (added 2.0)
 *              bannerColor:
 *                type: string
 *                description: Will set the banner background color in the client. The required format is color hex #FFFFFF.
 *              copyright:
 *                type: string
 *                description: Setting copyright=My custom copyright will replace the default copyright on the footer of the Flash client.
 *              muteOnStart:
 *                type: boolean
 *                description: Setting muteOnStart=true will mute all users when the meeting starts.
 *              allowModsToUnmuteUsers:
 *                type: boolean
 *                description: Default allowModsToUnmuteUsers=false. Setting to allowModsToUnmuteUsers=true will allow moderators to unmute other users in the meeting.
 *              lockSettingsDisableCam:
 *                type: boolean
 *                description: Default lockSettingsDisableCam=false. Setting lockSettingsDisableCam=true will prevent users from sharing their camera in the meeting.
 *              lockSettingsDisableMic:
 *                type: boolean
 *                description: Default lockSettingsDisableMic=false. Setting to lockSettingsDisableMic=true will only allow user to join listen only.
 *              lockSettingsDisablePrivateChat:
 *                type: boolean
 *                description: Default lockSettingsDisablePrivateChat=false. Setting to lockSettingsDisablePrivateChat=true will disable private chats in the meeting.
 *              lockSettingsDisablePublicChat:
 *                type: boolean
 *                description: Default lockSettingsDisablePublicChat=false. Setting to lockSettingsDisablePublicChat=true will disable public chat in the meeting.
 *              lockSettingsDisableNote:
 *                type: boolean
 *                description: Default lockSettingsDisableNote=false. Setting to lockSettingsDisableNote=true will disable notes in the meeting.
 *              lockSettingsLockedLayout:
 *                type: boolean
 *                description: Default lockSettingsLockedLayout=false. Setting to lockSettingsLockedLayout=true will lock the layout in the meeting.
 *              lockSettingsLockOnJoin:
 *                type: boolean
 *                description: Default lockSettingsLockOnJoin=true. Setting to lockSettingsLockOnJoin=false will not apply lock setting to users when they join.
 *              lockSettingsLockOnJoinConfigurable:
 *                type: boolean
 *                description: Default lockSettingsLockOnJoinConfigurable=false. Setting to lockSettingsLockOnJoinConfigurable=true will allow applying of lockSettingsLockOnJoin param.
 *              guestPolicy:
 *                type: string
 *                description: Default guestPolicy=ALWAYS_ACCEPT. Will set the guest policy for the meeting. The guest policy determines whether or not users who send a join request with guest=true will be allowed to join the meeting. Possible values are ALWAYS_ACCEPT, ALWAYS_DENY, and ASK_MODERATOR.
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /administration/join:
 *  post:
 *    summary: Create join-meeting url
 *    tags:
 *    - administration
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - fullName
 *              - meetingID
 *              - password
 *            properties:
 *              fullName:
 *                type: string
 *                description: The full name that is to be used to identify this user to other conference attendees.
 *              meetingId:
 *                type: string
 *                description: The meeting ID that identifies the meeting you are attempting to join.
 *              password:
 *                type: string
 *                description: The password that this attendee is using. If the moderator password is supplied, he will be given moderator status (and the same for attendee password, etc)
 *              createTime:
 *                type: string
 *                description: Third-party apps using the API can now pass createTime parameter (which was created in the create call), BigBlueButton will ensure it matches the ‘createTime’ for the session. If they differ, BigBlueButton will not proceed with the join request. This prevents a user from reusing their join URL for a subsequent session with the same meetingID.
 *              userID:
 *                type: string
 *                description: An identifier for this user that will help your application to identify which person this is. This user ID will be returned for this user in the getMeetingInfo API call so that you can check
 *              webVoiceConf:
 *                type: string
 *                description: If you want to pass in a custom voice-extension when a user joins the voice conference using voip. This is useful if you want to collect more info in you Call Detail Records about the user joining the conference. You need to modify your /etc/asterisk/bbb-extensions.conf to handle this new extensions.
 *              configToken:
 *                type: string
 *                description: The token returned by a setConfigXML API call. This causes the BigBlueButton client to load the config.xml associated with the token (not the default config.xml)
 *              defaultLayout:
 *                type: string
 *                description: The layout name to be loaded first when the application is loaded.
 *              avatarURL:
 *                type: string
 *                description: The link for the user’s avatar to be displayed when displayAvatar in config.xml is set to true (not yet implemented in the HTML5 client, see #8566.
 *              redirect:
 *                type: string
 *                description: The default behaviour of the JOIN API is to redirect the browser to the Flash client when the JOIN call succeeds. There have been requests if it’s possible to embed the Flash client in a “container” page and that the client starts as a hidden DIV tag which becomes visible on the successful JOIN. Setting this variable to FALSE will not redirect the browser but returns an XML instead whether the JOIN call has succeeded or not. The third party app is responsible for displaying the client to the user.
 *              clientURL:
 *                type: string
 *                description: Some third party apps what to display their own custom client. These apps can pass the URL containing the custom client and when redirect is not set to false, the browser will get redirected to the value of clientURL.
 *              joinViaHtml5:
 *                type: string
 *                description: Set to “true” to force the HTML5 client to load for the user.
 *              guest:
 *                type: string
 *                description: Set to “true” to indicate that the user is a guest, otherwise do NOT send this parameter.
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */

/**
 * @swagger
 *
 * /administration/end:
 *  post:
 *    summary: Creates end-meeting url
 *    tags:
 *    - administration
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - meetingId
 *              - moderatorPW
 *            properties:
 *              meetingId:
 *                type: string
 *                description: The meeting ID that identifies the meeting you are attempting to end.
 *              moderatorPW:
 *                type: string
 *                description: The moderator password for this meeting. You can not end a meeting using the attendee password.
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */

/**
 * @swagger
 *
 * /administration/end:
 *  delete:
 *    summary: Ends a meeting
 *    tags:
 *    - administration
 *    parameters:
 *       - name: meetingId
 *         description: The meeting ID that identifies the meeting you are attempting to end.
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         description: The moderator password for this meeting. You can not end a meeting using the attendee password.
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /administration:
 *  get:
 *    tags:
 *    - administration
 *    summary: Forbidden
 *    responses:
 *      204:
 *        description: No Content
 */
