/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./features/dashboard/components/upcoming-classes.tsx":
/*!************************************************************!*\
  !*** ./features/dashboard/components/upcoming-classes.tsx ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UpcomingClasses: () => (/* binding */ UpcomingClasses)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/features/virtual-classes/components/virtual-class-card */ \"(app-pages-browser)/./features/virtual-classes/components/virtual-class-card.tsx\");\n/* harmony import */ var _features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction UpcomingClasses(param) {\n    let { classes } = param;\n    // Sort classes by start time (earliest first)\n    const sortedClasses = [\n        ...classes\n    ].sort((a, b)=>new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime());\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"grid gap-4 md:grid-cols-2\",\n        children: sortedClasses.map((virtualClass)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_1__.VirtualClassCard, {\n                virtualClass: virtualClass,\n                showCourse: true\n            }, virtualClass.id, false, {\n                fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/dashboard/components/upcoming-classes.tsx\",\n                lineNumber: 17,\n                columnNumber: 9\n            }, this))\n    }, void 0, false, {\n        fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/dashboard/components/upcoming-classes.tsx\",\n        lineNumber: 15,\n        columnNumber: 5\n    }, this);\n}\n_c = UpcomingClasses;\nvar _c;\n$RefreshReg$(_c, \"UpcomingClasses\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2ZlYXR1cmVzL2Rhc2hib2FyZC9jb21wb25lbnRzL3VwY29taW5nLWNsYXNzZXMudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTJGO0FBT3BGLFNBQVNDLGdCQUFnQixLQUFpQztRQUFqQyxFQUFFQyxPQUFPLEVBQXdCLEdBQWpDO0lBQzlCLDhDQUE4QztJQUM5QyxNQUFNQyxnQkFBZ0I7V0FBSUQ7S0FBUSxDQUFDRSxJQUFJLENBQ3JDLENBQUNDLEdBQUdDLElBQU0sSUFBSUMsS0FBS0YsRUFBRUcsa0JBQWtCLEVBQUVDLE9BQU8sS0FBSyxJQUFJRixLQUFLRCxFQUFFRSxrQkFBa0IsRUFBRUMsT0FBTztJQUc3RixxQkFDRSw4REFBQ0M7UUFBSUMsV0FBVTtrQkFDWlIsY0FBY1MsR0FBRyxDQUFDLENBQUNDLDZCQUNsQiw4REFBQ2IscUdBQWdCQTtnQkFBdUJhLGNBQWNBO2dCQUFjQyxZQUFZO2VBQXpERCxhQUFhRSxFQUFFOzs7Ozs7Ozs7O0FBSTlDO0tBYmdCZCIsInNvdXJjZXMiOlsiL2hvbWUvd2F0a2F5L1JlYWN0UHJvamVjdHMvbGVhcm4tc21hcnQvc3R1ZGVudC1wb3J0YWwvZmVhdHVyZXMvZGFzaGJvYXJkL2NvbXBvbmVudHMvdXBjb21pbmctY2xhc3Nlcy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmlydHVhbENsYXNzQ2FyZCB9IGZyb20gXCJAL2ZlYXR1cmVzL3ZpcnR1YWwtY2xhc3Nlcy9jb21wb25lbnRzL3ZpcnR1YWwtY2xhc3MtY2FyZFwiXG5pbXBvcnQgdHlwZSB7IFZpcnR1YWxDbGFzcyB9IGZyb20gXCJAL2ZlYXR1cmVzL2Rhc2hib2FyZC90eXBlc1wiXG5cbmludGVyZmFjZSBVcGNvbWluZ0NsYXNzZXNQcm9wcyB7XG4gIGNsYXNzZXM6IFZpcnR1YWxDbGFzc1tdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBVcGNvbWluZ0NsYXNzZXMoeyBjbGFzc2VzIH06IFVwY29taW5nQ2xhc3Nlc1Byb3BzKSB7XG4gIC8vIFNvcnQgY2xhc3NlcyBieSBzdGFydCB0aW1lIChlYXJsaWVzdCBmaXJzdClcbiAgY29uc3Qgc29ydGVkQ2xhc3NlcyA9IFsuLi5jbGFzc2VzXS5zb3J0KFxuICAgIChhLCBiKSA9PiBuZXcgRGF0ZShhLnNjaGVkdWxlZFN0YXJ0VGltZSkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYi5zY2hlZHVsZWRTdGFydFRpbWUpLmdldFRpbWUoKSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdhcC00IG1kOmdyaWQtY29scy0yXCI+XG4gICAgICB7c29ydGVkQ2xhc3Nlcy5tYXAoKHZpcnR1YWxDbGFzcykgPT4gKFxuICAgICAgICA8VmlydHVhbENsYXNzQ2FyZCBrZXk9e3ZpcnR1YWxDbGFzcy5pZH0gdmlydHVhbENsYXNzPXt2aXJ0dWFsQ2xhc3N9IHNob3dDb3Vyc2U9e3RydWV9IC8+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIlZpcnR1YWxDbGFzc0NhcmQiLCJVcGNvbWluZ0NsYXNzZXMiLCJjbGFzc2VzIiwic29ydGVkQ2xhc3NlcyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJzY2hlZHVsZWRTdGFydFRpbWUiLCJnZXRUaW1lIiwiZGl2IiwiY2xhc3NOYW1lIiwibWFwIiwidmlydHVhbENsYXNzIiwic2hvd0NvdXJzZSIsImlkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./features/dashboard/components/upcoming-classes.tsx\n"));

/***/ }),

/***/ "(app-pages-browser)/./features/virtual-classes/components/virtual-class-card.tsx":
/*!********************************************************************!*\
  !*** ./features/virtual-classes/components/virtual-class-card.tsx ***!
  \********************************************************************/
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


/***/ })

});