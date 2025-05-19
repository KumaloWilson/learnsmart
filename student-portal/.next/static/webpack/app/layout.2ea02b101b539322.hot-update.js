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
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"d1672ddd17d1\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9nbG9iYWxzLmNzcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsaUVBQWUsY0FBYztBQUM3QixJQUFJLElBQVUsSUFBSSxpQkFBaUIiLCJzb3VyY2VzIjpbIi9ob21lL3dhdGtheS9SZWFjdFByb2plY3RzL2xlYXJuLXNtYXJ0L3N0dWRlbnQtcG9ydGFsL2FwcC9nbG9iYWxzLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcImQxNjcyZGRkMTdkMVwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./features/virtual-classes/redux/virtualClassesSlice.ts":
/*!***************************************************************!*\
  !*** ./features/virtual-classes/redux/virtualClassesSlice.ts ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clearErrors: () => (/* binding */ clearErrors),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   fetchVirtualClasses: () => (/* binding */ fetchVirtualClasses),\n/* harmony export */   joinVirtualClass: () => (/* binding */ joinVirtualClass)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n/* harmony import */ var _features_virtual_classes_services_virtual_classes_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/features/virtual-classes/services/virtual-classes-service */ \"(app-pages-browser)/./features/virtual-classes/services/virtual-classes-service.ts\");\n/* harmony import */ var _features_virtual_classes_services_virtual_classes_service__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_features_virtual_classes_services_virtual_classes_service__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst initialState = {\n    virtualClasses: [],\n    isLoading: false,\n    isJoining: false,\n    error: null,\n    joinError: null\n};\nconst fetchVirtualClasses = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__.createAsyncThunk)(\"virtualClasses/fetchAll\", async (param, param1)=>{\n    let { studentProfileId, token } = param, { rejectWithValue } = param1;\n    try {\n        const data = await _features_virtual_classes_services_virtual_classes_service__WEBPACK_IMPORTED_MODULE_0__.virtualClassesService.getVirtualClasses(studentProfileId, token);\n        return data;\n    } catch (error) {\n        if (error instanceof Error) {\n            return rejectWithValue(error.message);\n        }\n        return rejectWithValue(\"An unexpected error occurred\");\n    }\n});\nconst joinVirtualClass = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__.createAsyncThunk)(\"virtualClasses/join\", async (param, param1)=>{\n    let { studentProfileId, virtualClassId, token } = param, { rejectWithValue } = param1;\n    try {\n        const data = await _features_virtual_classes_services_virtual_classes_service__WEBPACK_IMPORTED_MODULE_0__.virtualClassesService.joinVirtualClass(studentProfileId, virtualClassId, token);\n        return data;\n    } catch (error) {\n        if (error instanceof Error) {\n            return rejectWithValue(error.message);\n        }\n        return rejectWithValue(\"An unexpected error occurred\");\n    }\n});\nconst virtualClassesSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__.createSlice)({\n    name: \"virtualClasses\",\n    initialState,\n    reducers: {\n        clearErrors: (state)=>{\n            state.error = null;\n            state.joinError = null;\n        }\n    },\n    extraReducers: (builder)=>{\n        builder.addCase(fetchVirtualClasses.pending, (state)=>{\n            state.isLoading = true;\n            state.error = null;\n        }).addCase(fetchVirtualClasses.fulfilled, (state, action)=>{\n            state.isLoading = false;\n            state.virtualClasses = action.payload;\n        }).addCase(fetchVirtualClasses.rejected, (state, action)=>{\n            state.isLoading = false;\n            state.error = action.payload;\n        }).addCase(joinVirtualClass.pending, (state)=>{\n            state.isJoining = true;\n            state.joinError = null;\n        }).addCase(joinVirtualClass.fulfilled, (state)=>{\n            state.isJoining = false;\n        }).addCase(joinVirtualClass.rejected, (state, action)=>{\n            state.isJoining = false;\n            state.joinError = action.payload;\n        });\n    }\n});\nconst { clearErrors } = virtualClassesSlice.actions;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (virtualClassesSlice.reducer);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2ZlYXR1cmVzL3ZpcnR1YWwtY2xhc3Nlcy9yZWR1eC92aXJ0dWFsQ2xhc3Nlc1NsaWNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBZ0U7QUFDbUM7QUFXbkcsTUFBTUcsZUFBb0M7SUFDeENDLGdCQUFnQixFQUFFO0lBQ2xCQyxXQUFXO0lBQ1hDLFdBQVc7SUFDWEMsT0FBTztJQUNQQyxXQUFXO0FBQ2I7QUFFTyxNQUFNQyxzQkFBc0JSLGtFQUFnQkEsQ0FDakQsMkJBQ0E7UUFBTyxFQUFFUyxnQkFBZ0IsRUFBRUMsS0FBSyxFQUFFLFVBQUUsRUFBRUMsZUFBZSxFQUFFO0lBQ3JELElBQUk7UUFDRixNQUFNQyxPQUFPLE1BQU1YLDZHQUFxQkEsQ0FBQ1ksaUJBQWlCLENBQUNKLGtCQUFrQkM7UUFDN0UsT0FBT0U7SUFDVCxFQUFFLE9BQU9OLE9BQU87UUFDZCxJQUFJQSxpQkFBaUJRLE9BQU87WUFDMUIsT0FBT0gsZ0JBQWdCTCxNQUFNUyxPQUFPO1FBQ3RDO1FBQ0EsT0FBT0osZ0JBQWdCO0lBQ3pCO0FBQ0YsR0FDRDtBQUVNLE1BQU1LLG1CQUFtQmhCLGtFQUFnQkEsQ0FHOUMsdUJBQXVCO1FBQU8sRUFBRVMsZ0JBQWdCLEVBQUVRLGNBQWMsRUFBRVAsS0FBSyxFQUFFLFVBQUUsRUFBRUMsZUFBZSxFQUFFO0lBQzlGLElBQUk7UUFDRixNQUFNQyxPQUFPLE1BQU1YLDZHQUFxQkEsQ0FBQ2UsZ0JBQWdCLENBQUNQLGtCQUFrQlEsZ0JBQWdCUDtRQUM1RixPQUFPRTtJQUNULEVBQUUsT0FBT04sT0FBTztRQUNkLElBQUlBLGlCQUFpQlEsT0FBTztZQUMxQixPQUFPSCxnQkFBZ0JMLE1BQU1TLE9BQU87UUFDdEM7UUFDQSxPQUFPSixnQkFBZ0I7SUFDekI7QUFDRixHQUFFO0FBRUYsTUFBTU8sc0JBQXNCbkIsNkRBQVdBLENBQUM7SUFDdENvQixNQUFNO0lBQ05qQjtJQUNBa0IsVUFBVTtRQUNSQyxhQUFhLENBQUNDO1lBQ1pBLE1BQU1oQixLQUFLLEdBQUc7WUFDZGdCLE1BQU1mLFNBQVMsR0FBRztRQUNwQjtJQUNGO0lBQ0FnQixlQUFlLENBQUNDO1FBQ2RBLFFBQ0dDLE9BQU8sQ0FBQ2pCLG9CQUFvQmtCLE9BQU8sRUFBRSxDQUFDSjtZQUNyQ0EsTUFBTWxCLFNBQVMsR0FBRztZQUNsQmtCLE1BQU1oQixLQUFLLEdBQUc7UUFDaEIsR0FDQ21CLE9BQU8sQ0FBQ2pCLG9CQUFvQm1CLFNBQVMsRUFBRSxDQUFDTCxPQUFPTTtZQUM5Q04sTUFBTWxCLFNBQVMsR0FBRztZQUNsQmtCLE1BQU1uQixjQUFjLEdBQUd5QixPQUFPQyxPQUFPO1FBQ3ZDLEdBQ0NKLE9BQU8sQ0FBQ2pCLG9CQUFvQnNCLFFBQVEsRUFBRSxDQUFDUixPQUFPTTtZQUM3Q04sTUFBTWxCLFNBQVMsR0FBRztZQUNsQmtCLE1BQU1oQixLQUFLLEdBQUdzQixPQUFPQyxPQUFPO1FBQzlCLEdBQ0NKLE9BQU8sQ0FBQ1QsaUJBQWlCVSxPQUFPLEVBQUUsQ0FBQ0o7WUFDbENBLE1BQU1qQixTQUFTLEdBQUc7WUFDbEJpQixNQUFNZixTQUFTLEdBQUc7UUFDcEIsR0FDQ2tCLE9BQU8sQ0FBQ1QsaUJBQWlCVyxTQUFTLEVBQUUsQ0FBQ0w7WUFDcENBLE1BQU1qQixTQUFTLEdBQUc7UUFDcEIsR0FDQ29CLE9BQU8sQ0FBQ1QsaUJBQWlCYyxRQUFRLEVBQUUsQ0FBQ1IsT0FBT007WUFDMUNOLE1BQU1qQixTQUFTLEdBQUc7WUFDbEJpQixNQUFNZixTQUFTLEdBQUdxQixPQUFPQyxPQUFPO1FBQ2xDO0lBQ0o7QUFDRjtBQUVPLE1BQU0sRUFBRVIsV0FBVyxFQUFFLEdBQUdILG9CQUFvQmEsT0FBTztBQUMxRCxpRUFBZWIsb0JBQW9CYyxPQUFPIiwic291cmNlcyI6WyIvaG9tZS93YXRrYXkvUmVhY3RQcm9qZWN0cy9sZWFybi1zbWFydC9zdHVkZW50LXBvcnRhbC9mZWF0dXJlcy92aXJ0dWFsLWNsYXNzZXMvcmVkdXgvdmlydHVhbENsYXNzZXNTbGljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTbGljZSwgY3JlYXRlQXN5bmNUaHVuayB9IGZyb20gXCJAcmVkdXhqcy90b29sa2l0XCJcbmltcG9ydCB7IHZpcnR1YWxDbGFzc2VzU2VydmljZSB9IGZyb20gXCJAL2ZlYXR1cmVzL3ZpcnR1YWwtY2xhc3Nlcy9zZXJ2aWNlcy92aXJ0dWFsLWNsYXNzZXMtc2VydmljZVwiXG5pbXBvcnQgdHlwZSB7IFZpcnR1YWxDbGFzcywgSm9pblZpcnR1YWxDbGFzc1Jlc3BvbnNlIH0gZnJvbSBcIkAvZmVhdHVyZXMvdmlydHVhbC1jbGFzc2VzL3R5cGVzXCJcblxuaW50ZXJmYWNlIFZpcnR1YWxDbGFzc2VzU3RhdGUge1xuICB2aXJ0dWFsQ2xhc3NlczogVmlydHVhbENsYXNzW11cbiAgaXNMb2FkaW5nOiBib29sZWFuXG4gIGlzSm9pbmluZzogYm9vbGVhblxuICBlcnJvcjogc3RyaW5nIHwgbnVsbFxuICBqb2luRXJyb3I6IHN0cmluZyB8IG51bGxcbn1cblxuY29uc3QgaW5pdGlhbFN0YXRlOiBWaXJ0dWFsQ2xhc3Nlc1N0YXRlID0ge1xuICB2aXJ0dWFsQ2xhc3NlczogW10sXG4gIGlzTG9hZGluZzogZmFsc2UsXG4gIGlzSm9pbmluZzogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICBqb2luRXJyb3I6IG51bGwsXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaFZpcnR1YWxDbGFzc2VzID0gY3JlYXRlQXN5bmNUaHVuazxWaXJ0dWFsQ2xhc3NbXSwgeyBzdHVkZW50UHJvZmlsZUlkOiBzdHJpbmc7IHRva2VuOiBzdHJpbmcgfT4oXG4gIFwidmlydHVhbENsYXNzZXMvZmV0Y2hBbGxcIixcbiAgYXN5bmMgKHsgc3R1ZGVudFByb2ZpbGVJZCwgdG9rZW4gfSwgeyByZWplY3RXaXRoVmFsdWUgfSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdmlydHVhbENsYXNzZXNTZXJ2aWNlLmdldFZpcnR1YWxDbGFzc2VzKHN0dWRlbnRQcm9maWxlSWQsIHRva2VuKVxuICAgICAgcmV0dXJuIGRhdGFcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdFdpdGhWYWx1ZShlcnJvci5tZXNzYWdlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlamVjdFdpdGhWYWx1ZShcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWRcIilcbiAgICB9XG4gIH0sXG4pXG5cbmV4cG9ydCBjb25zdCBqb2luVmlydHVhbENsYXNzID0gY3JlYXRlQXN5bmNUaHVuazxcbiAgSm9pblZpcnR1YWxDbGFzc1Jlc3BvbnNlLFxuICB7IHN0dWRlbnRQcm9maWxlSWQ6IHN0cmluZzsgdmlydHVhbENsYXNzSWQ6IHN0cmluZzsgdG9rZW46IHN0cmluZyB9XG4+KFwidmlydHVhbENsYXNzZXMvam9pblwiLCBhc3luYyAoeyBzdHVkZW50UHJvZmlsZUlkLCB2aXJ0dWFsQ2xhc3NJZCwgdG9rZW4gfSwgeyByZWplY3RXaXRoVmFsdWUgfSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB2aXJ0dWFsQ2xhc3Nlc1NlcnZpY2Uuam9pblZpcnR1YWxDbGFzcyhzdHVkZW50UHJvZmlsZUlkLCB2aXJ0dWFsQ2xhc3NJZCwgdG9rZW4pXG4gICAgcmV0dXJuIGRhdGFcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHJlamVjdFdpdGhWYWx1ZShlcnJvci5tZXNzYWdlKVxuICAgIH1cbiAgICByZXR1cm4gcmVqZWN0V2l0aFZhbHVlKFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZFwiKVxuICB9XG59KVxuXG5jb25zdCB2aXJ0dWFsQ2xhc3Nlc1NsaWNlID0gY3JlYXRlU2xpY2Uoe1xuICBuYW1lOiBcInZpcnR1YWxDbGFzc2VzXCIsXG4gIGluaXRpYWxTdGF0ZSxcbiAgcmVkdWNlcnM6IHtcbiAgICBjbGVhckVycm9yczogKHN0YXRlKSA9PiB7XG4gICAgICBzdGF0ZS5lcnJvciA9IG51bGxcbiAgICAgIHN0YXRlLmpvaW5FcnJvciA9IG51bGxcbiAgICB9LFxuICB9LFxuICBleHRyYVJlZHVjZXJzOiAoYnVpbGRlcikgPT4ge1xuICAgIGJ1aWxkZXJcbiAgICAgIC5hZGRDYXNlKGZldGNoVmlydHVhbENsYXNzZXMucGVuZGluZywgKHN0YXRlKSA9PiB7XG4gICAgICAgIHN0YXRlLmlzTG9hZGluZyA9IHRydWVcbiAgICAgICAgc3RhdGUuZXJyb3IgPSBudWxsXG4gICAgICB9KVxuICAgICAgLmFkZENhc2UoZmV0Y2hWaXJ0dWFsQ2xhc3Nlcy5mdWxmaWxsZWQsIChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgIHN0YXRlLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHN0YXRlLnZpcnR1YWxDbGFzc2VzID0gYWN0aW9uLnBheWxvYWRcbiAgICAgIH0pXG4gICAgICAuYWRkQ2FzZShmZXRjaFZpcnR1YWxDbGFzc2VzLnJlamVjdGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICBzdGF0ZS5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgICBzdGF0ZS5lcnJvciA9IGFjdGlvbi5wYXlsb2FkIGFzIHN0cmluZ1xuICAgICAgfSlcbiAgICAgIC5hZGRDYXNlKGpvaW5WaXJ0dWFsQ2xhc3MucGVuZGluZywgKHN0YXRlKSA9PiB7XG4gICAgICAgIHN0YXRlLmlzSm9pbmluZyA9IHRydWVcbiAgICAgICAgc3RhdGUuam9pbkVycm9yID0gbnVsbFxuICAgICAgfSlcbiAgICAgIC5hZGRDYXNlKGpvaW5WaXJ0dWFsQ2xhc3MuZnVsZmlsbGVkLCAoc3RhdGUpID0+IHtcbiAgICAgICAgc3RhdGUuaXNKb2luaW5nID0gZmFsc2VcbiAgICAgIH0pXG4gICAgICAuYWRkQ2FzZShqb2luVmlydHVhbENsYXNzLnJlamVjdGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICBzdGF0ZS5pc0pvaW5pbmcgPSBmYWxzZVxuICAgICAgICBzdGF0ZS5qb2luRXJyb3IgPSBhY3Rpb24ucGF5bG9hZCBhcyBzdHJpbmdcbiAgICAgIH0pXG4gIH0sXG59KVxuXG5leHBvcnQgY29uc3QgeyBjbGVhckVycm9ycyB9ID0gdmlydHVhbENsYXNzZXNTbGljZS5hY3Rpb25zXG5leHBvcnQgZGVmYXVsdCB2aXJ0dWFsQ2xhc3Nlc1NsaWNlLnJlZHVjZXJcbiJdLCJuYW1lcyI6WyJjcmVhdGVTbGljZSIsImNyZWF0ZUFzeW5jVGh1bmsiLCJ2aXJ0dWFsQ2xhc3Nlc1NlcnZpY2UiLCJpbml0aWFsU3RhdGUiLCJ2aXJ0dWFsQ2xhc3NlcyIsImlzTG9hZGluZyIsImlzSm9pbmluZyIsImVycm9yIiwiam9pbkVycm9yIiwiZmV0Y2hWaXJ0dWFsQ2xhc3NlcyIsInN0dWRlbnRQcm9maWxlSWQiLCJ0b2tlbiIsInJlamVjdFdpdGhWYWx1ZSIsImRhdGEiLCJnZXRWaXJ0dWFsQ2xhc3NlcyIsIkVycm9yIiwibWVzc2FnZSIsImpvaW5WaXJ0dWFsQ2xhc3MiLCJ2aXJ0dWFsQ2xhc3NJZCIsInZpcnR1YWxDbGFzc2VzU2xpY2UiLCJuYW1lIiwicmVkdWNlcnMiLCJjbGVhckVycm9ycyIsInN0YXRlIiwiZXh0cmFSZWR1Y2VycyIsImJ1aWxkZXIiLCJhZGRDYXNlIiwicGVuZGluZyIsImZ1bGZpbGxlZCIsImFjdGlvbiIsInBheWxvYWQiLCJyZWplY3RlZCIsImFjdGlvbnMiLCJyZWR1Y2VyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./features/virtual-classes/redux/virtualClassesSlice.ts\n"));

/***/ }),

/***/ "(app-pages-browser)/./features/virtual-classes/services/virtual-classes-service.ts":
/*!**********************************************************************!*\
  !*** ./features/virtual-classes/services/virtual-classes-service.ts ***!
  \**********************************************************************/
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