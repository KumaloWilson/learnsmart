/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./app/globals.css":
/*!*************************!*\
  !*** ./app/globals.css ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"14a93dd90748\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9nbG9iYWxzLmNzcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsaUVBQWUsY0FBYztBQUM3QixJQUFJLElBQVUsSUFBSSxpQkFBaUIiLCJzb3VyY2VzIjpbIi9ob21lL3dhdGtheS9SZWFjdFByb2plY3RzL2xlYXJuLXNtYXJ0L3N0dWRlbnQtcG9ydGFsL2FwcC9nbG9iYWxzLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjE0YTkzZGQ5MDc0OFwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./features/quiz-history/redux/quizHistorySlice.ts":
/*!*********************************************************!*\
  !*** ./features/quiz-history/redux/quizHistorySlice.ts ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./redux/store.ts":
/*!************************!*\
  !*** ./redux/store.ts ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   store: () => (/* binding */ store)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n/* harmony import */ var _features_auth_redux_authSlice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/features/auth/redux/authSlice */ \"(app-pages-browser)/./features/auth/redux/authSlice.ts\");\n/* harmony import */ var _features_dashboard_redux_dashboardSlice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/features/dashboard/redux/dashboardSlice */ \"(app-pages-browser)/./features/dashboard/redux/dashboardSlice.ts\");\n/* harmony import */ var _features_courses_redux_coursesSlice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/features/courses/redux/coursesSlice */ \"(app-pages-browser)/./features/courses/redux/coursesSlice.ts\");\n/* harmony import */ var _features_virtual_classes_redux_virtualClassesSlice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/features/virtual-classes/redux/virtualClassesSlice */ \"(app-pages-browser)/./features/virtual-classes/redux/virtualClassesSlice.ts\");\n/* harmony import */ var _features_user_redux_userSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/features/user/redux/userSlice */ \"(app-pages-browser)/./features/user/redux/userSlice.ts\");\n/* harmony import */ var _features_assessments_redux_assessmentsSlice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/features/assessments/redux/assessmentsSlice */ \"(app-pages-browser)/./features/assessments/redux/assessmentsSlice.ts\");\n/* harmony import */ var _features_performance_redux_performanceSlice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/features/performance/redux/performanceSlice */ \"(app-pages-browser)/./features/performance/redux/performanceSlice.ts\");\n/* harmony import */ var _features_course_materials_redux_courseMaterialsSlice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/features/course-materials/redux/courseMaterialsSlice */ \"(app-pages-browser)/./features/course-materials/redux/courseMaterialsSlice.ts\");\n/* harmony import */ var _features_quiz_history_redux_quizHistorySlice__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/features/quiz-history/redux/quizHistorySlice */ \"(app-pages-browser)/./features/quiz-history/redux/quizHistorySlice.ts\");\n/* harmony import */ var _features_quiz_history_redux_quizHistorySlice__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_features_quiz_history_redux_quizHistorySlice__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _features_attendance_redux_attendanceSlice__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/features/attendance/redux/attendanceSlice */ \"(app-pages-browser)/./features/attendance/redux/attendanceSlice.ts\");\n/* harmony import */ var _features_academic_records_redux_academicRecordsSlice__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/features/academic-records/redux/academicRecordsSlice */ \"(app-pages-browser)/./features/academic-records/redux/academicRecordsSlice.ts\");\n/* harmony import */ var _features_ai_recommendations_redux_aiRecommendationsSlice__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/features/ai-recommendations/redux/aiRecommendationsSlice */ \"(app-pages-browser)/./features/ai-recommendations/redux/aiRecommendationsSlice.ts\");\n/* harmony import */ var _features_quizzes_redux_quizSlice__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/features/quizzes/redux/quizSlice */ \"(app-pages-browser)/./features/quizzes/redux/quizSlice.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconst store = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_13__.configureStore)({\n    reducer: {\n        auth: _features_auth_redux_authSlice__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n        dashboard: _features_dashboard_redux_dashboardSlice__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n        courses: _features_courses_redux_coursesSlice__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n        virtualClasses: _features_virtual_classes_redux_virtualClassesSlice__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n        user: _features_user_redux_userSlice__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n        assessments: _features_assessments_redux_assessmentsSlice__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n        performance: _features_performance_redux_performanceSlice__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n        courseMaterials: _features_course_materials_redux_courseMaterialsSlice__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n        quizHistory: (_features_quiz_history_redux_quizHistorySlice__WEBPACK_IMPORTED_MODULE_8___default()),\n        attendance: _features_attendance_redux_attendanceSlice__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n        academicRecords: _features_academic_records_redux_academicRecordsSlice__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n        aiRecommendations: _features_ai_recommendations_redux_aiRecommendationsSlice__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n        quiz: _features_quizzes_redux_quizSlice__WEBPACK_IMPORTED_MODULE_12__[\"default\"]\n    }\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3JlZHV4L3N0b3JlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBaUQ7QUFDUTtBQUNlO0FBQ047QUFDc0I7QUFDL0I7QUFDcUI7QUFDQTtBQUNhO0FBQ1o7QUFDSjtBQUNnQjtBQUNNO0FBQ3JDO0FBRXJELE1BQU1jLFFBQVFkLGlFQUFjQSxDQUFDO0lBQ2xDZSxTQUFTO1FBQ1BDLE1BQU1mLHNFQUFXQTtRQUNqQmdCLFdBQVdmLGdGQUFnQkE7UUFDM0JnQixTQUFTZiw0RUFBY0E7UUFDdkJnQixnQkFBZ0JmLDJGQUFxQkE7UUFDckNnQixNQUFNZixzRUFBV0E7UUFDakJnQixhQUFhZixvRkFBa0JBO1FBQy9CZ0IsYUFBYWYsb0ZBQWtCQTtRQUMvQmdCLGlCQUFpQmYsNkZBQXNCQTtRQUN2Q2dCLGFBQWFmLHNGQUFrQkE7UUFDL0JnQixZQUFZZixrRkFBaUJBO1FBQzdCZ0IsaUJBQWlCZiw4RkFBc0JBO1FBQ3ZDZ0IsbUJBQW1CZixrR0FBd0JBO1FBQzNDZ0IsTUFBTWYsMEVBQVdBO0lBQ25CO0FBQ0YsR0FBRSIsInNvdXJjZXMiOlsiL2hvbWUvd2F0a2F5L1JlYWN0UHJvamVjdHMvbGVhcm4tc21hcnQvc3R1ZGVudC1wb3J0YWwvcmVkdXgvc3RvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlndXJlU3RvcmUgfSBmcm9tIFwiQHJlZHV4anMvdG9vbGtpdFwiXG5pbXBvcnQgYXV0aFJlZHVjZXIgZnJvbSBcIkAvZmVhdHVyZXMvYXV0aC9yZWR1eC9hdXRoU2xpY2VcIlxuaW1wb3J0IGRhc2hib2FyZFJlZHVjZXIgZnJvbSBcIkAvZmVhdHVyZXMvZGFzaGJvYXJkL3JlZHV4L2Rhc2hib2FyZFNsaWNlXCJcbmltcG9ydCBjb3Vyc2VzUmVkdWNlciBmcm9tIFwiQC9mZWF0dXJlcy9jb3Vyc2VzL3JlZHV4L2NvdXJzZXNTbGljZVwiXG5pbXBvcnQgdmlydHVhbENsYXNzZXNSZWR1Y2VyIGZyb20gXCJAL2ZlYXR1cmVzL3ZpcnR1YWwtY2xhc3Nlcy9yZWR1eC92aXJ0dWFsQ2xhc3Nlc1NsaWNlXCJcbmltcG9ydCB1c2VyUmVkdWNlciBmcm9tIFwiQC9mZWF0dXJlcy91c2VyL3JlZHV4L3VzZXJTbGljZVwiXG5pbXBvcnQgYXNzZXNzbWVudHNSZWR1Y2VyIGZyb20gXCJAL2ZlYXR1cmVzL2Fzc2Vzc21lbnRzL3JlZHV4L2Fzc2Vzc21lbnRzU2xpY2VcIlxuaW1wb3J0IHBlcmZvcm1hbmNlUmVkdWNlciBmcm9tIFwiQC9mZWF0dXJlcy9wZXJmb3JtYW5jZS9yZWR1eC9wZXJmb3JtYW5jZVNsaWNlXCJcbmltcG9ydCBjb3Vyc2VNYXRlcmlhbHNSZWR1Y2VyIGZyb20gXCJAL2ZlYXR1cmVzL2NvdXJzZS1tYXRlcmlhbHMvcmVkdXgvY291cnNlTWF0ZXJpYWxzU2xpY2VcIlxuaW1wb3J0IHF1aXpIaXN0b3J5UmVkdWNlciBmcm9tIFwiQC9mZWF0dXJlcy9xdWl6LWhpc3RvcnkvcmVkdXgvcXVpekhpc3RvcnlTbGljZVwiXG5pbXBvcnQgYXR0ZW5kYW5jZVJlZHVjZXIgZnJvbSBcIkAvZmVhdHVyZXMvYXR0ZW5kYW5jZS9yZWR1eC9hdHRlbmRhbmNlU2xpY2VcIlxuaW1wb3J0IGFjYWRlbWljUmVjb3Jkc1JlZHVjZXIgZnJvbSBcIkAvZmVhdHVyZXMvYWNhZGVtaWMtcmVjb3Jkcy9yZWR1eC9hY2FkZW1pY1JlY29yZHNTbGljZVwiXG5pbXBvcnQgYWlSZWNvbW1lbmRhdGlvbnNSZWR1Y2VyIGZyb20gXCJAL2ZlYXR1cmVzL2FpLXJlY29tbWVuZGF0aW9ucy9yZWR1eC9haVJlY29tbWVuZGF0aW9uc1NsaWNlXCJcbmltcG9ydCBxdWl6UmVkdWNlciBmcm9tIFwiQC9mZWF0dXJlcy9xdWl6emVzL3JlZHV4L3F1aXpTbGljZVwiXG5cbmV4cG9ydCBjb25zdCBzdG9yZSA9IGNvbmZpZ3VyZVN0b3JlKHtcbiAgcmVkdWNlcjoge1xuICAgIGF1dGg6IGF1dGhSZWR1Y2VyLFxuICAgIGRhc2hib2FyZDogZGFzaGJvYXJkUmVkdWNlcixcbiAgICBjb3Vyc2VzOiBjb3Vyc2VzUmVkdWNlcixcbiAgICB2aXJ0dWFsQ2xhc3NlczogdmlydHVhbENsYXNzZXNSZWR1Y2VyLFxuICAgIHVzZXI6IHVzZXJSZWR1Y2VyLFxuICAgIGFzc2Vzc21lbnRzOiBhc3Nlc3NtZW50c1JlZHVjZXIsXG4gICAgcGVyZm9ybWFuY2U6IHBlcmZvcm1hbmNlUmVkdWNlcixcbiAgICBjb3Vyc2VNYXRlcmlhbHM6IGNvdXJzZU1hdGVyaWFsc1JlZHVjZXIsXG4gICAgcXVpekhpc3Rvcnk6IHF1aXpIaXN0b3J5UmVkdWNlcixcbiAgICBhdHRlbmRhbmNlOiBhdHRlbmRhbmNlUmVkdWNlcixcbiAgICBhY2FkZW1pY1JlY29yZHM6IGFjYWRlbWljUmVjb3Jkc1JlZHVjZXIsXG4gICAgYWlSZWNvbW1lbmRhdGlvbnM6IGFpUmVjb21tZW5kYXRpb25zUmVkdWNlcixcbiAgICBxdWl6OiBxdWl6UmVkdWNlcixcbiAgfSxcbn0pXG5cbmV4cG9ydCB0eXBlIFJvb3RTdGF0ZSA9IFJldHVyblR5cGU8dHlwZW9mIHN0b3JlLmdldFN0YXRlPlxuZXhwb3J0IHR5cGUgQXBwRGlzcGF0Y2ggPSB0eXBlb2Ygc3RvcmUuZGlzcGF0Y2hcbiJdLCJuYW1lcyI6WyJjb25maWd1cmVTdG9yZSIsImF1dGhSZWR1Y2VyIiwiZGFzaGJvYXJkUmVkdWNlciIsImNvdXJzZXNSZWR1Y2VyIiwidmlydHVhbENsYXNzZXNSZWR1Y2VyIiwidXNlclJlZHVjZXIiLCJhc3Nlc3NtZW50c1JlZHVjZXIiLCJwZXJmb3JtYW5jZVJlZHVjZXIiLCJjb3Vyc2VNYXRlcmlhbHNSZWR1Y2VyIiwicXVpekhpc3RvcnlSZWR1Y2VyIiwiYXR0ZW5kYW5jZVJlZHVjZXIiLCJhY2FkZW1pY1JlY29yZHNSZWR1Y2VyIiwiYWlSZWNvbW1lbmRhdGlvbnNSZWR1Y2VyIiwicXVpelJlZHVjZXIiLCJzdG9yZSIsInJlZHVjZXIiLCJhdXRoIiwiZGFzaGJvYXJkIiwiY291cnNlcyIsInZpcnR1YWxDbGFzc2VzIiwidXNlciIsImFzc2Vzc21lbnRzIiwicGVyZm9ybWFuY2UiLCJjb3Vyc2VNYXRlcmlhbHMiLCJxdWl6SGlzdG9yeSIsImF0dGVuZGFuY2UiLCJhY2FkZW1pY1JlY29yZHMiLCJhaVJlY29tbWVuZGF0aW9ucyIsInF1aXoiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./redux/store.ts\n"));

/***/ })

});