function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/html-parser/scanners/cdata-scanner.js']) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'] = {};
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[6] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[7] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[11] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[14] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[16] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[19] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[20] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[23] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[24] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[25] = 0;
}
if (! _$jscoverage['/html-parser/scanners/cdata-scanner.js'].functionData) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].functionData = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].functionData[0] = 0;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].functionData[1] = 0;
}
if (! _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData = {};
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['14'] = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['14'][1] = new BranchData();
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'] = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'][1] = new BranchData();
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'][2] = new BranchData();
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['17'] = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['17'][1] = new BranchData();
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['18'] = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['18'][1] = new BranchData();
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['24'] = [];
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['24'][1] = new BranchData();
}
_$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['24'][1].init(637, 7, 'content');
function visit279_24_1(result) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['24'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['18'][1].init(43, 27, 'node.tagName == tag.tagName');
function visit278_18_1(result) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['18'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['17'][1].init(44, 71, 'node.isEndTag() && node.tagName == tag.tagName');
function visit277_17_1(result) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['17'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'][2].init(55, 18, 'node.nodeType != 1');
function visit276_16_2(result) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'][2].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'][1].init(55, 117, 'node.nodeType != 1 || !(node.isEndTag() && node.tagName == tag.tagName)');
function visit275_16_1(result) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['16'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['14'][1].init(287, 4, 'node');
function visit274_14_1(result) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].branchData['14'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[6]++;
KISSY.add("html-parser/scanners/cdata-scanner", function() {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].functionData[0]++;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[7]++;
  return {
  scan: function(tag, lexer, opts) {
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].functionData[1]++;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[11]++;
  var content = lexer.parseCDATA(opts.quoteSmart, tag.nodeName), position = lexer.getPosition(), node = lexer.nextNode();
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[14]++;
  if (visit274_14_1(node)) {
    _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[16]++;
    if (visit275_16_1(visit276_16_2(node.nodeType != 1) || !(visit277_17_1(node.isEndTag() && visit278_18_1(node.tagName == tag.tagName))))) {
      _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[19]++;
      lexer.setPosition(position);
      _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[20]++;
      node = null;
    }
  }
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[23]++;
  tag.closed = true;
  _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[24]++;
  if (visit279_24_1(content)) {
    _$jscoverage['/html-parser/scanners/cdata-scanner.js'].lineData[25]++;
    tag.appendChild(content);
  }
}};
});