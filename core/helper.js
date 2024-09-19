const url = require("url");

//to encrypt db password and compare encrypt
const encrypt = {
  generateHash: function (str) {
    try {
      const bcrypt = require("bcrypt");
      const saltRound = +process.env.SALT_ROUND || 10;
      return bcrypt.hashSync(str, bcrypt.genSaltSync(saltRound));
    } catch (error) {
      return false;
    }
  },
  compareHash: function (str, strHash) {
    try {
      const bcrypt = require("bcrypt");
      return bcrypt.compareSync(str, strHash);
    } catch (error) {
      return false;
    }
  },
};

//get message lang specific
let message = function (code) {
  var m = require("../core/message");
  if (!code in m || isNaN(code)) {
    code = 1001;
  }
  var msg = m[code];
  if (!msg) {
    msg = m[1001];
  }
  return msg;
};

//send error
let error = function (res, code, data, send) {
  if (!send && send != 0) {
    send = 1;
  }

  if (!data) {
    data = [];
  }

  if (isNaN(code) || code == 0) {
    code = 1001;
  }

  var err = message(code);

  let errtxt = {
    code: err.httpCode,
    message: err.message,
  };

  if (send == 1) {
    res.statusCode = err.httpCode;
    res.json(errtxt);
    res.end();
  } else {
    return Promise.reject(errtxt);
  }
};

//send success response
let success = function (res, data, code) {
  if (!data) {
    data = [];
  }
  if (code > 0) {
    var m = message(code);
    res.json({
      code: m.httpCode,
      message: m.message,
      data: data,
    });
  } else {
    res.json(data);
  }
  //res.json({ code: 0, message: message, data: data });
};

let SendListResponse = function (
  req,
  res,
  data,
  code,
  total_record,
  title = null
) {
  if (!data) {
    data = null;
  }
  var params = req?.query;
  var page = Number(params.page) || 0,
    page_size = Number(params.size) || 25,
    begin = page * page_size;
  // var end = Math.min((page_size * (page + 1)), records);
  // var lastPage = Math.max(Math.ceil(records / page_size), 1);

  let pagination = {
    length: total_record,
    size: page_size,
    page: page,
    sort: params.sort,
    order: params.order,
    search: params.search,
  };

  if (code > 0) {
    var m = message(code);
    if (title) {
      res.json({
        code: 0,
        message: m.message,
        ...title,
        pagination: pagination,
        data: data,
      });
    } else {
      res.json({
        code: 0,
        message: m.message,
        pagination: pagination,
        data: data,
      });
    }
  } else {
    if (title) {
      res.json({ pagination: pagination, ...title, data: data });
    } else {
      res.json({ pagination: pagination, data: data });
    }
  }
};

let reqPaginationQueryMap = function (params) {
  let _query = {
    limit: 25,
    skip: 0,
    sort: "createdAt",
    order: 1,
    searchBy: "",
    search: "",
  };

  if (!params) {
    return _query;
  }
  if (params.size >= 0 && params.size < 201) {
    _query["limit"] = parseInt(params.size);
  }
  if (params.page >= 0) {
    params.page = parseInt(params.page);
    _query["skip"] = _query["limit"] * params.page;
  }
  if (params.sort && params.order) {
    _query["sort"] = params.sort;
    _query["order"] = params.order.toLowerCase() == "asc" ? 1 : -1;
  }
  if (params.searchBy && params.search) {
    _query["searchBy"] = params.searchBy;
    _query["search"] = params.search;
  }
  return _query;
};

//validate request param
let paramValidate = function () {
  let resCode = 0;

  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i].val) {
      resCode = arguments[i].code;
      break;
    }
  }

  if (resCode > 0) {
    return Promise.reject(resCode);
  }
  return Promise.resolve();
};

//check is email valide or not
let isValidEmail = function (email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

//to hash db password
let md5 = function (str) {
  var MD5 = require("md5");
  return MD5("some_salt_and_pepper_" + str + "_searce_ass_backend_2024");
};

const currentTimeStamp = function () {
  const moment = require("moment");
  return moment().utc().valueOf();
};
module.exports = {
  encrypt,
  error,
  success,
  SendListResponse,
  reqPaginationQueryMap,
  paramValidate,
  isValidEmail,
  md5,
  currentTimeStamp,
};
