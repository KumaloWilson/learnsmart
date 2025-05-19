/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/courses/[courseId]/page",{

/***/ "(app-pages-browser)/./features/courses/components/course-virtual-classes.tsx":
/*!****************************************************************!*\
  !*** ./features/courses/components/course-virtual-classes.tsx ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CourseVirtualClasses: () => (/* binding */ CourseVirtualClasses)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _components_ui_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ui/card */ \"(app-pages-browser)/./components/ui/card.tsx\");\n/* harmony import */ var _features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/features/virtual-classes/components/virtual-class-card */ \"(app-pages-browser)/./features/virtual-classes/components/virtual-class-card.tsx\");\n/* harmony import */ var _features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction CourseVirtualClasses(param) {\n    let { virtualClasses } = param;\n    if (!virtualClasses.length) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_1__.Card, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_1__.CardHeader, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_1__.CardTitle, {\n                        children: \"Virtual Classes\"\n                    }, void 0, false, {\n                        fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/courses/components/course-virtual-classes.tsx\",\n                        lineNumber: 14,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_1__.CardDescription, {\n                        children: \"No virtual classes scheduled for this course yet.\"\n                    }, void 0, false, {\n                        fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/courses/components/course-virtual-classes.tsx\",\n                        lineNumber: 15,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/courses/components/course-virtual-classes.tsx\",\n                lineNumber: 13,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/courses/components/course-virtual-classes.tsx\",\n            lineNumber: 12,\n            columnNumber: 7\n        }, this);\n    }\n    // Sort classes by start time (upcoming first, then past)\n    const now = new Date();\n    const sortedClasses = [\n        ...virtualClasses\n    ].sort((a, b)=>{\n        const aDate = new Date(a.scheduledStartTime);\n        const bDate = new Date(b.scheduledStartTime);\n        const aIsPast = aDate < now;\n        const bIsPast = bDate < now;\n        if (aIsPast && !bIsPast) return 1;\n        if (!aIsPast && bIsPast) return -1;\n        return aDate.getTime() - bDate.getTime();\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"space-y-4\",\n        children: sortedClasses.map((virtualClass)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_features_virtual_classes_components_virtual_class_card__WEBPACK_IMPORTED_MODULE_2__.VirtualClassCard, {\n                virtualClass: virtualClass\n            }, virtualClass.id, false, {\n                fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/courses/components/course-virtual-classes.tsx\",\n                lineNumber: 37,\n                columnNumber: 9\n            }, this))\n    }, void 0, false, {\n        fileName: \"/home/watkay/ReactProjects/learn-smart/student-portal/features/courses/components/course-virtual-classes.tsx\",\n        lineNumber: 35,\n        columnNumber: 5\n    }, this);\n}\n_c = CourseVirtualClasses;\nvar _c;\n$RefreshReg$(_c, \"CourseVirtualClasses\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2ZlYXR1cmVzL2NvdXJzZXMvY29tcG9uZW50cy9jb3Vyc2UtdmlydHVhbC1jbGFzc2VzLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBbUY7QUFDUTtBQU9wRixTQUFTSyxxQkFBcUIsS0FBNkM7UUFBN0MsRUFBRUMsY0FBYyxFQUE2QixHQUE3QztJQUNuQyxJQUFJLENBQUNBLGVBQWVDLE1BQU0sRUFBRTtRQUMxQixxQkFDRSw4REFBQ1AscURBQUlBO3NCQUNILDRFQUFDRSwyREFBVUE7O2tDQUNULDhEQUFDQywwREFBU0E7a0NBQUM7Ozs7OztrQ0FDWCw4REFBQ0YsZ0VBQWVBO2tDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztJQUl6QjtJQUVBLHlEQUF5RDtJQUN6RCxNQUFNTyxNQUFNLElBQUlDO0lBQ2hCLE1BQU1DLGdCQUFnQjtXQUFJSjtLQUFlLENBQUNLLElBQUksQ0FBQyxDQUFDQyxHQUFHQztRQUNqRCxNQUFNQyxRQUFRLElBQUlMLEtBQUtHLEVBQUVHLGtCQUFrQjtRQUMzQyxNQUFNQyxRQUFRLElBQUlQLEtBQUtJLEVBQUVFLGtCQUFrQjtRQUMzQyxNQUFNRSxVQUFVSCxRQUFRTjtRQUN4QixNQUFNVSxVQUFVRixRQUFRUjtRQUV4QixJQUFJUyxXQUFXLENBQUNDLFNBQVMsT0FBTztRQUNoQyxJQUFJLENBQUNELFdBQVdDLFNBQVMsT0FBTyxDQUFDO1FBQ2pDLE9BQU9KLE1BQU1LLE9BQU8sS0FBS0gsTUFBTUcsT0FBTztJQUN4QztJQUVBLHFCQUNFLDhEQUFDQztRQUFJQyxXQUFVO2tCQUNaWCxjQUFjWSxHQUFHLENBQUMsQ0FBQ0MsNkJBQ2xCLDhEQUFDbkIscUdBQWdCQTtnQkFBdUJtQixjQUFjQTtlQUEvQkEsYUFBYUMsRUFBRTs7Ozs7Ozs7OztBQUk5QztLQWhDZ0JuQiIsInNvdXJjZXMiOlsiL2hvbWUvd2F0a2F5L1JlYWN0UHJvamVjdHMvbGVhcm4tc21hcnQvc3R1ZGVudC1wb3J0YWwvZmVhdHVyZXMvY291cnNlcy9jb21wb25lbnRzL2NvdXJzZS12aXJ0dWFsLWNsYXNzZXMudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcmQsIENhcmREZXNjcmlwdGlvbiwgQ2FyZEhlYWRlciwgQ2FyZFRpdGxlIH0gZnJvbSBcIkAvY29tcG9uZW50cy91aS9jYXJkXCJcbmltcG9ydCB7IFZpcnR1YWxDbGFzc0NhcmQgfSBmcm9tIFwiQC9mZWF0dXJlcy92aXJ0dWFsLWNsYXNzZXMvY29tcG9uZW50cy92aXJ0dWFsLWNsYXNzLWNhcmRcIlxuaW1wb3J0IHR5cGUgeyBWaXJ0dWFsQ2xhc3MgfSBmcm9tIFwiQC9mZWF0dXJlcy9jb3Vyc2VzL3R5cGVzXCJcblxuaW50ZXJmYWNlIENvdXJzZVZpcnR1YWxDbGFzc2VzUHJvcHMge1xuICB2aXJ0dWFsQ2xhc3NlczogVmlydHVhbENsYXNzW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvdXJzZVZpcnR1YWxDbGFzc2VzKHsgdmlydHVhbENsYXNzZXMgfTogQ291cnNlVmlydHVhbENsYXNzZXNQcm9wcykge1xuICBpZiAoIXZpcnR1YWxDbGFzc2VzLmxlbmd0aCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q2FyZD5cbiAgICAgICAgPENhcmRIZWFkZXI+XG4gICAgICAgICAgPENhcmRUaXRsZT5WaXJ0dWFsIENsYXNzZXM8L0NhcmRUaXRsZT5cbiAgICAgICAgICA8Q2FyZERlc2NyaXB0aW9uPk5vIHZpcnR1YWwgY2xhc3NlcyBzY2hlZHVsZWQgZm9yIHRoaXMgY291cnNlIHlldC48L0NhcmREZXNjcmlwdGlvbj5cbiAgICAgICAgPC9DYXJkSGVhZGVyPlxuICAgICAgPC9DYXJkPlxuICAgIClcbiAgfVxuXG4gIC8vIFNvcnQgY2xhc3NlcyBieSBzdGFydCB0aW1lICh1cGNvbWluZyBmaXJzdCwgdGhlbiBwYXN0KVxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gIGNvbnN0IHNvcnRlZENsYXNzZXMgPSBbLi4udmlydHVhbENsYXNzZXNdLnNvcnQoKGEsIGIpID0+IHtcbiAgICBjb25zdCBhRGF0ZSA9IG5ldyBEYXRlKGEuc2NoZWR1bGVkU3RhcnRUaW1lKVxuICAgIGNvbnN0IGJEYXRlID0gbmV3IERhdGUoYi5zY2hlZHVsZWRTdGFydFRpbWUpXG4gICAgY29uc3QgYUlzUGFzdCA9IGFEYXRlIDwgbm93XG4gICAgY29uc3QgYklzUGFzdCA9IGJEYXRlIDwgbm93XG5cbiAgICBpZiAoYUlzUGFzdCAmJiAhYklzUGFzdCkgcmV0dXJuIDFcbiAgICBpZiAoIWFJc1Bhc3QgJiYgYklzUGFzdCkgcmV0dXJuIC0xXG4gICAgcmV0dXJuIGFEYXRlLmdldFRpbWUoKSAtIGJEYXRlLmdldFRpbWUoKVxuICB9KVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgIHtzb3J0ZWRDbGFzc2VzLm1hcCgodmlydHVhbENsYXNzKSA9PiAoXG4gICAgICAgIDxWaXJ0dWFsQ2xhc3NDYXJkIGtleT17dmlydHVhbENsYXNzLmlkfSB2aXJ0dWFsQ2xhc3M9e3ZpcnR1YWxDbGFzc30gLz5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApXG59XG4iXSwibmFtZXMiOlsiQ2FyZCIsIkNhcmREZXNjcmlwdGlvbiIsIkNhcmRIZWFkZXIiLCJDYXJkVGl0bGUiLCJWaXJ0dWFsQ2xhc3NDYXJkIiwiQ291cnNlVmlydHVhbENsYXNzZXMiLCJ2aXJ0dWFsQ2xhc3NlcyIsImxlbmd0aCIsIm5vdyIsIkRhdGUiLCJzb3J0ZWRDbGFzc2VzIiwic29ydCIsImEiLCJiIiwiYURhdGUiLCJzY2hlZHVsZWRTdGFydFRpbWUiLCJiRGF0ZSIsImFJc1Bhc3QiLCJiSXNQYXN0IiwiZ2V0VGltZSIsImRpdiIsImNsYXNzTmFtZSIsIm1hcCIsInZpcnR1YWxDbGFzcyIsImlkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./features/courses/components/course-virtual-classes.tsx\n"));

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