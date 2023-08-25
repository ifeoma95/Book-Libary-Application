"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
(0, dotenv_1.config)();
mongoose_1.default.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => {
    console.log('db connected');
})
    .catch((err) => {
    console.error(err);
});
const index_1 = __importDefault(require("./routes/index"));
const author_1 = __importDefault(require("./routes/author"));
const book_1 = __importDefault(require("./routes/book"));
const app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/', index_1.default);
app.use('/users', author_1.default);
app.use('/users/d/books', book_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
