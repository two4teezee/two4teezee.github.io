import { definePlugin } from "@expressive-code/core";

// ZSS Language Plugin for Expressive Code
// Based on the ZSS UDL file provided

export function pluginZssLanguage() {
	return definePlugin({
		name: "ZSS Language Support",
		hooks: {
			// Empty hooks for now - just register the plugin
		},
	});
}

export const zssLang = {
	displayName: "ZSS",
	name: "zss",
	patterns: [
		// Line comments starting with #
		{
			name: "comment.line.number-sign.zss",
			match: "#.*$",
		},

		// String literals (double quotes)
		{
			name: "string.quoted.double.zss",
			begin: '"',
			end: '"',
			patterns: [
				{
					name: "constant.character.escape.zss",
					match: "\\\\.",
				},
			],
		},

		// String literals (single quotes)
		{
			name: "string.quoted.single.zss",
			begin: "'",
			end: "'",
			patterns: [
				{
					name: "constant.character.escape.zss",
					match: "\\\\.",
				},
			],
		},

		// Numbers
		{
			name: "constant.numeric.zss",
			match: "\\b\\d+(\\.\\d+)?\\b",
		},

		// Variables with $ prefix (Keywords6)
		{
			name: "variable.parameter.zss",
			match: "\\$\\w+",
		},

		// Control flow keywords (Keywords1) - Blue, Bold
		{
			name: "keyword.control.zss",
			match:
				"\\b(if|else|let|call|while|for|break|continue|switch|case|default|Function|StateDef)\\b",
		},

		// Built-in functions and variables (Keywords2) - Purple
		{
			name: "support.function.zss",
			match:
				"\\b(ID|abs|acos|aiLevel|aiLevelF|airJumpCount|alive|alpha|angle|anim|animElem|animElemLength|animElemNo|animElemTime|animExist|animElemVar|animLength|animPlayerNo|animTime|asin|atan|atan2|attack|authorName|backEdge|backEdgeBodyDist|backEdgeDist|bgmLength|bgmPosition|bgmVar|bottomEdge|cameraPos|cameraZoom|canRecover|ceil|clamp|clsnOverlap|clsnVar|comboCount|command|cond|consecutiveWins|const|const1080p|const240p|const480p|const720p|cos|ctrl|defence|deg|displayName|dizzy|dizzyPoints|dizzyPointsMax|drawGame|drawPalNo|e|envShakeVar|exp|explodVar|fVar|facing|fightScreenVar|fightTime|firstAttack|float|floor|framesPerCount|frontEdge|frontEdgeBodyDist|frontEdgeDist|gameHeight|gameMode|gameOption|gameTime|gameWidth|getHitVar|getPlayerId|groundAngle|groundLevel|guardBreak|guardCount|guardPoints|guardPointsMax|helperID|helperId|helperIndexExist|helperName|hitCount|hitDefAttr|hitDefVar|hitFall|hitOver|hitOverridden|hitPauseTime|hitShakeOver|hitVel|id|ifElse|ikemenVersion|inCustomAnim|inCustomState|inDialogue|inGuardDist|index|inputTime|introState|isAsserted|isHelper|isHomeTeam|isHost|jugglePoints|lastPlayerID|lastPlayerId|layerNo|leftEdge|lerp|life|lifeMax|ln|localCoord|localScale|log|lose|loseKo|loseTime|majorVersion|map|matchNo|matchOver|max|memberNo|min|moveContact|moveCountered|moveGuarded|moveHit|moveHitVar|moveReversed|moveType|mugenVersion|name|numEnemy|numExplod|numHelper|numPartner|numPlayer|numProj|numProjID|numProjId|numTarget|numText|p1Name|p2BodyDist|p2Dist|p2Life|p2MoveType|p2Name|p2StateNo|p2StateType|p3Name|p4Name|p5Name|p6Name|p7Name|p8Name|palFxVar|palNo|parentDist|pauseTime|physics|pi|playerCount|playerIDExist|playerIdExist|playerIndexExist|playerNo|pos|power|powerMax|prevAnim|prevMoveType|prevStateNo|prevStateType|projCancelTime|projContact|projContactTime|projGuarded|projGuardedTime|projHit|projHitTime|projVar|rad|rand|random|randomRange|ratioLevel|receivedDamage|receivedHits|redLife|reversalDefAttr|rightEdge|rootDist|round|roundNo|roundState|roundType|roundsExisted|runOrder|scale|score|scoreTotal|screenHeight|screenPos|screenWidth|selfAnimExist|selfCommand|selfStatenoExist|sign|sin|sprPriority|stageBackEdge|stageBackEdgeDist|stageConst|stageFrontEdge|stageFrontEdgeDist|stageTime|stageVar|standBy|stateNo|stateType|sysFVar|sysFvar|sysVar|tan|teamLeader|teamMode|teamSide|teamSize|ticksPerSecond|time|timeElapsed|timeMod|timeRemaining|timeTotal|topEdge|uniqHitCount|var|vel|win|winHyper|winKo|winPerfect|winSpecial|winTime|topBoundDist|botBoundDist|hitByAttr|soundVar|debug|decisiveRound|fightScreenState|topBoundBodyDist|systemVar|roundTime|playerNoExist|botBoundBodyDist|motifState|outroState)\\b",
		},

		// Object references (Keywords3) - Dark Blue, Bold+Italic
		{
			name: "support.type.zss",
			match:
				"\\b(player|parent|root|helper|target|partner|enemy|enemyNear|playerId|stateOwner|helperIndex|p2|playerIndex)\\b",
		},

		// Actions/Commands (Keywords4) - Dark Blue with light blue background
		{
			name: "support.function.builtin.zss",
			match:
				"\\b(afterImage|afterImageTime|allPalFx|angleAdd|angleDraw|angleMul|angleSet|appendToClipboard|assertInput|assertSpecial|attackDist|attackMulSet|bgPalFx|bindToParent|bindToRoot|bindToTarget|changeAnim|changeAnim2|changeState|clearClipboard|ctrlSet|defenceMulSet|destroySelf|dialogue|displayToClipboard|dizzyPointsAdd|dizzyPointsSet|dizzySet|envColor|envShake|explod|explodBindTime|fallEnvShake|forceFeedback|gameMakeAnim|gravity|guardBreakSet|guardPointsAdd|guardPointsSet|helper|hitAdd|hitBy|hitDef|hitFallDamage|hitFallSet|hitFallVel|hitOverride|hitScaleSet|hitVelSet|lifeAdd|lifebarAction|lifeSet|loadFile|makeDust|mapAdd|mapSet|matchRestart|modifyExplod|modifyStageVar|moveHitReset|notHitBy|null|offset|palFx|parentMapAdd|parentMapSet|parentVarAdd|parentVarSet|pause|playerPush|playBgm|playSnd|posAdd|posFreeze|posSet|powerAdd|powerSet|printToConsole|projectile|rankAdd|redLifeAdd|redLifeSet|remapPal|remapSprite|removeExplod|reversalDef|rootMapAdd|rootMapSet|rootVarAdd|rootVarSet|roundTimeAdd|roundTimeSet|saveFile|scoreAdd|screenBound|selfState|sndPan|sprPriority|stateTypeSet|stopSnd|superPause|tagIn|tagOut|targetBind|targetDrop|targetFacing|targetGuardPointsAdd|targetLifeAdd|targetPowerAdd|targetRedLifeAdd|targetScoreAdd|targetState|targetVelAdd|targetVelSet|teamMapAdd|teamMapSet|text|trans|turn|varAdd|varRandom|varRangeSet|varSet|velAdd|velMul|velSet|victoryQuote|width|zoom|assertCommand|targetAdd|targetDizzyPointsAdd|transformClsn|groundLevelOffset|height|getHitVarSet|modifyBGCtrl|shadowOffset|removeText|modifySnd|modifyHitDef|modifyPlayer|modifyProjectile|modifyReversalDef|modifyBgm|depth)\\b",
		},

		// Modifiers (Keywords5) - Teal, Italic
		{
			name: "storage.modifier.zss",
			match: "\\b(persistent|ignoreHitPause)\\b",
		},

		// Special keywords (Keywords8) - Dark Blue with light background
		{
			name: "keyword.other.special.zss",
			match: "\\b(interpolation|redirectId|redirectID)\\b",
		},

		// Parameter names (Keywords6 attributes) - Long list from UDL
		{
			name: "entity.name.tag.zss",
			match:
				"\\b(absolute|abspan|accel|add|addtype|affects|affectteam|afterimage\\.length|afterimage\\.time|air\\.animtype|air\\.cornerpush\\.veloff|air\\.fall|air\\.hittime|air\\.juggle|air\\.type|air\\.velocity|airguard\\.cornerpush\\.veloff|airguard\\.ctrltime|airguard\\.velocity|align|alpha|ampl|angle|anim|animtype|attr|bank|bindid|bindtime|both|cases|chainid|channel|color|ctrl|damage|darken|dest|dizzypoints|down\\.bounce|down\\.cornerpush\\.veloff|down\\.hittime|down\\.velocity|edge|elem|endcmdbuftime|envshake\\.ampl|envshake\\.freq|envshake\\.phase|envshake\\.time|excludeid|extendsmap|facep2|facing|fall\\.animtype|fall\\.damage|fall\\.envshake\\.ampl|fall\\.envshake\\.freq|fall\\.envshake\\.phase|fall\\.envshake\\.time|fall\\.kill|fall\\.recover|fall\\.recovertime|fall\\.xvelocity|fall\\.yvelocity|fall|first|flag|flag2|flag3|focallength|font|force|forceair|forcenofall|forcestand|framegap|freq|freqmul|fv|fvalue|getpower|givepower|ground\\.cornerpush\\.veloff|ground\\.hittime|ground\\.slidetime|ground\\.type|ground\\.velocity|guard\\.cornerpush\\.veloff|guard\\.ctrltime|guard\\.dist|guard\\.hittime|guard\\.kill|guard\\.pausetime|guard\\.slidetime|guard\\.sparkno|guard\\.velocity|guardflag|guardpoints|guardsound\\.channel|guardsound|helpertype|hitflag|hitonce|hitsound\\.channel|hitsound|id|ignorehitpause|immortal|in|inheritchannels|inheritjuggle|invertall|keepone|keyctrl|kill|kovelocity|last|layerno|leader|length|loop|loopend|loopstart|lowpriority|map|max|maxdist|min|mindist|movecamera|movetime|movetype|mul|multype|name|nochainid|none|numhits|offset|onhit|ontop|ownpal|p1def|p1facing|p1getp2facing|p1sprpriority|p1stateno|p2def|p2defmul|p2facing|p2getp1state|p2sprpriority|p2stateno|p3def|p4def|p5def|p6def|p7def|p8def|paladd|palbright|palcolor|palcontrast|palfx|palfx\\.add|palfx\\.mul|palfx\\.time|palinvertall|palmul|palpostbright|pan|params|partner|partnerstateno|path|pausebg|pausemovetime|pausetime|phase|physics|player|pos|pos2|postype|poweradd|preserve|preset|priority|projangle|projanim|projcancelanim|projection|projedgebound|projheightbound|projhitanim|projhits|projid|projmisstime|projpriority|projremanim|projremove|projremovetime|projscale|projshadow|projsprpriority|projstagebound|random|range|readplayerid|recursive|redirectid|redlife|reload|remappal|removeexplods|removeongethit|removetime|remvelocity|reset|reversal\\.attr|savedata|scale|score|self|shadow|sinadd|size\\.air\\.back|size\\.air\\.front|size\\.ground\\.back|size\\.ground\\.front|size\\.head\\.pos|size\\.height|size\\.mid\\.pos|size\\.proj\\.doscale|size\\.shadowoffset|size\\.xscale|size\\.yscale|slot|snap|snd|sound|source|space|spacing|sparkno|sparkxy|spr|sprpriority|stagebound|stagedef|stateno|statetype|supermove|supermovetime|teamside|text|time|timegap|timemul|top|trans|type|under|unhittable|v|value|vel|velmul|velocity|velset|vfacing|volume|volumescale|waveform|x|xangle|xvel|y|yaccel|yangle|yvel|animelem|reversal|hue|removeonchangestate|buffer|priority|loopstart|loopend|startposition|loopcount|stopongethit|stoponchangestate|projclsnangle|projclsnscale|projdepthbound|projlayerno|lag|camerabound|keepstate|playerid|localcoord|textdelay|friction|linespacing|partnerctrl|reflection|z|bgm|displayname|lifebarname|lifemax|powermax|dizzypointsmax|guardpointsmax|teamside|helperid|helpername|fall|fall\\.envshake\\.mul|ctrltime|fallcount|groundtype|guarded|hitshaketime|hittime|playerno|recovertime|slidetime|envshake|recover|airtype|air|guard|sparkangle|ground|dist|juggle|depth|down|forcecrouch|p2clsnrequire|p2clsncheck|hitsound|guardsound|airguard|xaccel|veloff|cornerpush|xvelocity|yvelocity|bounce|animfreeze|index|hidebars|sinmul|movecountered|movereversed|moveguarded|movehit|sinhue|window|hitpausetime):",
		},

		// Operators
		{
			name: "keyword.operator.zss",
			match: "[+\\-*/%!&|^~=<>\\[\\]().,:;]|=:",
		},

		// Brackets for folding
		{
			name: "punctuation.definition.block.begin.zss",
			match: "\\{",
		},
		{
			name: "punctuation.definition.block.end.zss",
			match: "\\}",
		},
	],
	scopeName: "source.zss",
};
