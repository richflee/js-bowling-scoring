// var scoresStr = '43|X|X|12|4/|42';
var scoresStr = 'X|X|X|X|X|X|X|X|X|X';

var getFrameType = function(frameTries){
    if (isStrike(frameTries)) {
        return 'STRIKE';
    } else if (isSpare(frameTries)) {
        return 'SPARE';
    }  else {
        return 'STANDARD';
    }
}

var isStrike = function(frame) {
    return frame && frame.includes('X')
};

var isSpare = function(frame) { 
    return frame && frame.includes('/');
};

function generateAccumulator(initFrameFn) {
    return function scoreAccumulator(evalFns) {
        return initFrameFn() + evalFns.reduce((acc, fn) => acc + fn(), 0);
    }
}

function getScoreFn(frameTries) {
    return isStrike(frameTries) || isSpare(frameTries)
        ? function() { return 10; }
        : function() { return evalFrame(frameTries) };
}

function evalFrame(frameTries) {
    return frameTries.reduce((acc, t) => acc + (+t), 0);
}


var bowlingFrames = scoresStr.split('|');
let score = 0;
for (let i = 0; i < bowlingFrames.length; i++) {

    var frameTries = bowlingFrames[i].split('');
    var evalFn = getScoreFn(frameTries);
    var frameType = getFrameType(frameTries);

    if (frameType === 'STANDARD') {
        score += evalFn();
        continue;
    }

    var frameScoreAccumulatorFn = generateAccumulator(evalFn);
    var nextFrame = bowlingFrames[i + 1];

    if (!nextFrame) {
        continue;
    }

    var nextFrameTries = nextFrame.split('');
    var accumulativeFns = [];

    if (frameType === 'SPARE') {
        var tries = [nextFrameTries[0]];
        accumulativeFns.push(getScoreFn(tries));
    } else {
        accumulativeFns.push(getScoreFn(nextFrameTries));
        if (isStrike(nextFrameTries) && !!bowlingFrames[i + 2]) {
            var tries = [bowlingFrames[i + 2].split('')[0]];
            accumulativeFns.push(getScoreFn(tries));
        }
    }

    score += frameScoreAccumulatorFn(accumulativeFns);
}

console.log('score', score);
