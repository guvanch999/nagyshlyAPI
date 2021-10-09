var MsgTmFlags = {
	SUCCESS:                              "ok",
	ERROR:                                "fail",
	INVALID_PARAMS:                       "Request parameter error",
	PHONE_EMAIL_REGISTERED:               "Telefon belgisi ýa-da e-poçta eýýäm hasaba alnan",
	INVALID_PHONE_NUMBER:                 "Nädogry telefon belgisi",
	INVALID_EMAIL:                        "Nädogry e-poçta",
	SMS_SERVICE_UNAVAILABLE:              "SMS hyzmaty häzirlikçe elýeter däl. E-poçta bilen synap görüň ýa-da soňrak synanyşyň.",
	AGREEMENT_TERM_FALSE:                 "AGREEMENT_TERM_FALSE",
	ERROR_AUTH:                           "Ulanyjy ady ýada parol nädogry",
	ERROR_PWD_MISMATCH:                   "Täze parollar gabat gelmeýär",
	ERROR_PWD_LEN:                        "Parolyň uzynlygy azyndan 6 simwoldan ybarat bolmaly",
	ERROR_USER_NAME_NOT_FOUND:            "Ulanyjy tapylmady",
	ERROR_CURR_PWD_INVALID:               "Häzirki parol nädogry",
	ERROR_TOKEN:                          "Täzeden giriň!",
	ERROR_API_KEY:                        "INVALID API KEY",
	ERROR_ADD_PRODUCT:                    "Haryt goşulmady. Ýalňyşlyk ýüze çykdy. Maglumatlary barlaň we täzeden synanşyň!",
	ERROR_UPLOAD_SAVE_IMAGE_FAIL:         "Surat ýüklände ýalňyşlyk ýüze çykdy!",
	ERROR_UPLOAD_CHECK_IMAGE_SIZE_FAIL:   "Surat ýüklenmedi. Suratyň ululygy 5Mb-den kiçi bolmaly!",
	ERROR_UPLOAD_CHECK_IMAGE_FORMAT_FAIL: "Surat formaty .jpeg, .jpg, .png bolmaly",
	ERROR_IMAGE_DOES_NOT_EXISTS:          "Surat tapylmady",
	INTERNAL_SERVER_ERROR:                "Serwer ýalňyşlygy",
	DELETE_COLOR_ERR:				   "Bu reňkli produktalar bar!"
}

var MsgRuFlags = {
	SUCCESS:                              "ok",
	ERROR:                                "fail",
	INVALID_PARAMS:                       "Ошибка параметра запроса",
	PHONE_EMAIL_REGISTERED:               "Номер телефона или адрес электронной почты уже зарегистрированы",
	INVALID_PHONE_NUMBER:                 "Неправильный номер телефона",
	INVALID_EMAIL:                        "Неверный адрес электронной почты",
	SMS_SERVICE_UNAVAILABLE:              "SMS-сервис в данный момент недоступен. Пожалуйста, попробуйте по электронной почте или повторите попытку позже.",
	AGREEMENT_TERM_FALSE:                 "AGREEMENT_TERM_FALSE",
	ERROR_AUTH:                           "Имя пользователя или пароль неверен",
	ERROR_PWD_MISMATCH:                   "Несоответствие новых паролей",
	ERROR_PWD_LEN:                        "Длина пароля должна быть не менее 6 символов",
	ERROR_USER_NAME_NOT_FOUND:            "Пользователь не найден",
	ERROR_CURR_PWD_INVALID:               "Текущий пароль недействителен",
	ERROR_TOKEN:                          "Пожалуйста, войдите еще раз!",
	ERROR_API_KEY:                        "INVALID API KEY",
	ERROR_ADD_PRODUCT:                    "Произошла ошибка. Не могу добавить товар. Пожалуйста, проверьте данные формы и попробуйте еще раз!",
	ERROR_UPLOAD_SAVE_IMAGE_FAIL:         "Ошибка при сохранении изображения!",
	ERROR_UPLOAD_CHECK_IMAGE_SIZE_FAIL:   "Изображение не сохранено. Размер изображения не должен превышать 5 МБ.",
	ERROR_UPLOAD_CHECK_IMAGE_FORMAT_FAIL: "Формат изображения должен быть .jpeg, .jpg, .png.",
	ERROR_IMAGE_DOES_NOT_EXISTS:          "Изображение не существует",
	INTERNAL_SERVER_ERROR:                "Cерверная ошибка",
	DELETE_COLOR_ERR:				   "Bu reňkli produktalar bar!"
}

module.exports={
      MsgRuFlags,
      MsgTmFlags,
}