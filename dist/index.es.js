import { defineComponent as Z, resolveComponent as ye, createElementBlock as u, openBlock as a, normalizeClass as O, createElementVNode as t, createCommentVNode as x, toDisplayString as y, createTextVNode as j, withModifiers as V, Fragment as F, renderList as q, withKeys as S, createBlock as ee, ref as k, watch as ge, computed as K, unref as N, withDirectives as P, vModelText as G, vModelSelect as ke, createVNode as be, TransitionGroup as $e, withCtx as Ce } from "vue";
import { useThesisQuery as _e, useSupabase as Te } from "@y2kfund/core";
import { useQueryClient as we } from "@tanstack/vue-query";
const Ee = { class: "thesis-item" }, Se = { class: "thesis-expand-icon" }, xe = { class: "thesis-info" }, Ie = { class: "thesis-title" }, Ae = {
  key: 0,
  class: "thesis-parent-badge"
}, De = {
  key: 0,
  class: "thesis-description"
}, Ve = { class: "thesis-actions" }, Me = {
  key: 0,
  class: "stocks-section"
}, Ne = { class: "stocks-header" }, Ue = { class: "stocks-table-wrapper" }, Be = { class: "stocks-table" }, Ke = { class: "stock-symbol" }, Fe = ["onDblclick"], qe = ["value", "onBlur", "onKeyup"], Le = { key: 1 }, Pe = ["onDblclick"], Qe = ["value", "onBlur", "onKeyup"], ze = { key: 1 }, He = ["onDblclick"], Re = ["checked", "onBlur", "onKeyup"], Ge = { key: 1 }, Oe = ["onDblclick"], je = ["checked", "onBlur", "onKeyup"], Je = { key: 1 }, We = { class: "stock-actions" }, Xe = ["onClick"], Ye = /* @__PURE__ */ Z({
  __name: "ThesisItem",
  props: {
    thesis: {},
    level: {},
    thesisStocks: {},
    expandedThesis: {},
    editingCell: {},
    editingValue: {}
  },
  emits: ["toggle", "edit", "delete", "add-stock", "delete-stock", "start-edit-cell", "save-edit", "cancel-edit", "get-cell-metadata", "update-editing-value"],
  setup(l, { emit: U }) {
    const o = U;
    function _(m) {
      o("update-editing-value", m);
    }
    return (m, n) => {
      var T;
      const B = ye("ThesisItem", !0);
      return a(), u("div", {
        class: O(["thesis-item-wrapper", `thesis-item-level-${l.level}`])
      }, [
        t("div", Ee, [
          t("div", {
            class: "thesis-content",
            onClick: n[0] || (n[0] = (d) => o("toggle", l.thesis.id))
          }, [
            t("div", Se, y(l.expandedThesis.has(l.thesis.id) ? "▼" : "▶"), 1),
            t("div", xe, [
              t("div", Ie, [
                j(y(l.thesis.title) + " ", 1),
                l.thesis.parent_thesis_id ? (a(), u("span", Ae, " ↳ Child ")) : x("", !0)
              ]),
              l.thesis.description ? (a(), u("div", De, y(l.thesis.description), 1)) : x("", !0)
            ])
          ]),
          t("div", Ve, [
            t("button", {
              class: "btn btn-secondary btn-sm btn-icon",
              onClick: n[1] || (n[1] = V((d) => o("edit", l.thesis), ["stop"])),
              title: "Edit thesis"
            }, " ✏️ "),
            t("button", {
              class: "btn btn-danger btn-sm btn-icon",
              onClick: n[2] || (n[2] = V((d) => o("delete", l.thesis.id, l.thesis.title), ["stop"])),
              title: "Archive thesis"
            }, " 🗑️ ")
          ])
        ]),
        l.expandedThesis.has(l.thesis.id) ? (a(), u("div", Me, [
          t("div", Ne, [
            t("h4", null, "Instruments (" + y(((T = l.thesisStocks[l.thesis.id]) == null ? void 0 : T.length) || 0) + ")", 1),
            t("button", {
              class: "btn btn-primary btn-sm btn-icon",
              onClick: n[3] || (n[3] = V((d) => o("add-stock", l.thesis.id), ["stop"])),
              title: "Add Instrument"
            }, " ➕ ")
          ]),
          t("div", Ue, [
            t("table", Be, [
              n[22] || (n[22] = t("thead", null, [
                t("tr", null, [
                  t("th", null, "Symbol"),
                  t("th", null, "PE Ratio"),
                  t("th", null, "PEG Ratio"),
                  t("th", null, "Passed Checks"),
                  t("th", null, "Currently Held"),
                  t("th", null, "Actions")
                ])
              ], -1)),
              t("tbody", null, [
                (a(!0), u(F, null, q(l.thesisStocks[l.thesis.id], (d) => {
                  var h, f, b, w, M, C, D, I;
                  return a(), u("tr", {
                    key: d.id
                  }, [
                    t("td", Ke, y(d.symbol), 1),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (c) => o("start-edit-cell", l.thesis.id, d, "pe_ratio")
                    }, [
                      ((h = l.editingCell) == null ? void 0 : h.stockId) === d.id && ((f = l.editingCell) == null ? void 0 : f.field) === "pe_ratio" ? (a(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[4] || (n[4] = (c) => _(c.target.valueAsNumber)),
                        onBlur: (c) => o("save-edit", d, "pe_ratio"),
                        onKeyup: [
                          S((c) => o("save-edit", d, "pe_ratio"), ["enter"]),
                          n[5] || (n[5] = S((c) => o("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, qe)) : (a(), u("span", Le, y(d.pe_ratio ?? "-"), 1))
                    ], 40, Fe),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (c) => o("start-edit-cell", l.thesis.id, d, "peg_ratio")
                    }, [
                      ((b = l.editingCell) == null ? void 0 : b.stockId) === d.id && ((w = l.editingCell) == null ? void 0 : w.field) === "peg_ratio" ? (a(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[6] || (n[6] = (c) => _(c.target.valueAsNumber)),
                        onBlur: (c) => o("save-edit", d, "peg_ratio"),
                        onKeyup: [
                          S((c) => o("save-edit", d, "peg_ratio"), ["enter"]),
                          n[7] || (n[7] = S((c) => o("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Qe)) : (a(), u("span", ze, y(d.peg_ratio ?? "-"), 1))
                    ], 40, Pe),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (c) => o("start-edit-cell", l.thesis.id, d, "passed_checks")
                    }, [
                      ((M = l.editingCell) == null ? void 0 : M.stockId) === d.id && ((C = l.editingCell) == null ? void 0 : C.field) === "passed_checks" ? (a(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[8] || (n[8] = (c) => _(c.target.checked)),
                        onBlur: (c) => o("save-edit", d, "passed_checks"),
                        onKeyup: [
                          S((c) => o("save-edit", d, "passed_checks"), ["enter"]),
                          n[9] || (n[9] = S((c) => o("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Re)) : (a(), u("span", Ge, y(d.passed_checks ? "✅" : "❌"), 1))
                    ], 40, He),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (c) => o("start-edit-cell", l.thesis.id, d, "currently_held")
                    }, [
                      ((D = l.editingCell) == null ? void 0 : D.stockId) === d.id && ((I = l.editingCell) == null ? void 0 : I.field) === "currently_held" ? (a(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[10] || (n[10] = (c) => _(c.target.checked)),
                        onBlur: (c) => o("save-edit", d, "currently_held"),
                        onKeyup: [
                          S((c) => o("save-edit", d, "currently_held"), ["enter"]),
                          n[11] || (n[11] = S((c) => o("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, je)) : (a(), u("span", Je, y(d.currently_held ? "✅" : "❌"), 1))
                    ], 40, Oe),
                    t("td", We, [
                      t("button", {
                        class: "btn btn-danger btn-sm btn-icon",
                        onClick: V((c) => o("delete-stock", l.thesis.id, d.id, d.symbol), ["stop"]),
                        title: "Remove instrument"
                      }, " 🗑️ ", 8, Xe)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ])
        ])) : x("", !0),
        l.thesis.children && l.thesis.children.length > 0 ? (a(!0), u(F, { key: 1 }, q(l.thesis.children, (d) => (a(), ee(B, {
          key: d.id,
          thesis: d,
          level: l.level + 1,
          "thesis-stocks": l.thesisStocks,
          "expanded-thesis": l.expandedThesis,
          "editing-cell": l.editingCell,
          "editing-value": l.editingValue,
          onToggle: n[12] || (n[12] = (h) => o("toggle", h)),
          onEdit: n[13] || (n[13] = (h) => o("edit", h)),
          onDelete: n[14] || (n[14] = (h, f) => o("delete", h, f)),
          onAddStock: n[15] || (n[15] = (h) => o("add-stock", h)),
          onDeleteStock: n[16] || (n[16] = (h, f, b) => o("delete-stock", h, f, b)),
          onStartEditCell: n[17] || (n[17] = (h, f, b) => o("start-edit-cell", h, f, b)),
          onSaveEdit: n[18] || (n[18] = (h, f) => o("save-edit", h, f)),
          onCancelEdit: n[19] || (n[19] = () => o("cancel-edit")),
          onGetCellMetadata: n[20] || (n[20] = (h, f) => o("get-cell-metadata", h, f)),
          onUpdateEditingValue: n[21] || (n[21] = (h) => o("update-editing-value", h))
        }, null, 8, ["thesis", "level", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128)) : x("", !0)
      ], 2);
    };
  }
}), te = (l, U) => {
  const o = l.__vccOpts || l;
  for (const [_, m] of U)
    o[_] = m;
  return o;
}, Ze = /* @__PURE__ */ te(Ye, [["__scopeId", "data-v-2e9c600f"]]), et = { class: "thesis-card" }, tt = {
  key: 0,
  class: "loading"
}, st = {
  key: 1,
  class: "error"
}, it = {
  key: 2,
  class: "thesis-container"
}, nt = { class: "thesis-header" }, lt = { class: "thesis-header-actions" }, ot = { class: "thesis-list" }, at = {
  key: 0,
  class: "thesis-empty"
}, dt = {
  key: 1,
  class: "thesis-items"
}, rt = { class: "modal-header" }, ut = { class: "modal-body" }, ct = { class: "form-group" }, ht = ["for"], vt = ["id"], mt = { class: "form-group" }, ft = ["for"], pt = ["id"], yt = { class: "form-group" }, gt = ["for"], kt = ["id"], bt = ["value"], $t = { class: "modal-footer" }, Ct = ["disabled"], _t = { class: "modal-header" }, Tt = { class: "modal-body" }, wt = { class: "form-group" }, Et = { class: "modal-footer" }, St = ["disabled"], xt = { class: "toast-container" }, It = ["onClick"], At = { class: "toast-icon" }, Dt = { key: 0 }, Vt = { key: 1 }, Mt = { key: 2 }, Nt = { key: 3 }, Ut = { class: "toast-content" }, Bt = { class: "toast-title" }, Kt = {
  key: 0,
  class: "toast-message"
}, Ft = ["onClick"], qt = /* @__PURE__ */ Z({
  __name: "Thesis",
  props: {
    userId: { default: null },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(l, { emit: U }) {
    const o = l, _ = U, m = _e(), n = Te(), B = we(), T = k("");
    async function d() {
      var s;
      try {
        const { data: { user: e } } = await n.auth.getUser();
        e != null && e.email ? T.value = e.email : (s = e == null ? void 0 : e.user_metadata) != null && s.name ? T.value = e.user_metadata.name : o.userId && (T.value = o.userId);
      } catch (e) {
        console.error("Error fetching current user:", e), o.userId && (T.value = o.userId);
      }
    }
    d();
    const h = k({}), f = k(null), b = k(null), w = k(!1), M = k(""), C = k(""), D = k(/* @__PURE__ */ new Set());
    async function I() {
      try {
        const { data: s, error: e } = await n.schema("hf").from("thesisStocks").select("*").order("symbol");
        if (e) throw e;
        const i = {};
        s == null || s.forEach((r) => {
          i[r.thesis_id] || (i[r.thesis_id] = []), i[r.thesis_id].push(r);
        }), h.value = i;
      } catch (s) {
        console.error("Error loading thesis stocks:", s), g("error", "Error", `Failed to load instruments: ${s.message}`);
      }
    }
    ge(() => m.data.value, (s) => {
      s && s.length > 0 && I();
    }, { immediate: !0 });
    function c(s) {
      D.value.has(s) ? D.value.delete(s) : D.value.add(s);
    }
    function se(s) {
      M.value = s, C.value = "", w.value = !0;
    }
    async function J() {
      if (!(!C.value.trim() || !M.value))
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisStocks").insert([{
            thesis_id: M.value,
            symbol: C.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1
          }]).select();
          if (e) throw e;
          await I(), C.value = "", w.value = !1, g("success", "Instrument Added", `${C.value} has been added to the thesis`);
        } catch (s) {
          console.error("Error adding stock:", s), g("error", "Error", `Failed to add instrument: ${s.message}`);
        }
    }
    async function ie(s, e, i) {
      if (confirm(`Are you sure you want to remove ${i} from this thesis?`))
        try {
          const { error: r } = await n.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (r) throw r;
          await I(), g("success", "Instrument Removed", `${i} has been removed from the thesis`);
        } catch (r) {
          console.error("Error deleting stock:", r), g("error", "Error", `Failed to remove stock: ${r.message}`);
        }
    }
    function ne(s, e, i) {
      f.value = { thesisId: s, stockId: e.id, field: i }, b.value = e[i];
    }
    function Q() {
      f.value = null, b.value = null;
    }
    async function le(s, e) {
      if (f.value) {
        if (!T.value) {
          g("error", "Error", "User information not available"), Q();
          return;
        }
        try {
          const i = {
            [e]: b.value,
            [`${e}_updated_by`]: T.value,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: r } = await n.schema("hf").from("thesisStocks").update(i).eq("id", s.id);
          if (r) throw r;
          await I(), Q(), g("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (i) {
          console.error("Error updating stock:", i), g("error", "Error", `Failed to update: ${i.message}`);
        }
      }
    }
    function oe(s, e) {
      const i = s[`${e}_updated_by`], r = s[`${e}_updated_at`];
      if (i && r) {
        const A = new Date(r).toLocaleString();
        return `Updated by: ${i}
Updated at: ${A}`;
      }
      return "No updates yet";
    }
    const E = k(!1), v = k("add"), $ = k({ title: "", description: "", parent_thesis_id: null }), p = k({ id: "", title: "", description: "", parent_thesis_id: null }), z = K({
      get: () => v.value === "add" ? $.value.title : p.value.title,
      set: (s) => {
        v.value === "add" ? $.value.title = s : p.value.title = s;
      }
    }), W = K({
      get: () => v.value === "add" ? $.value.description : p.value.description,
      set: (s) => {
        v.value === "add" ? $.value.description = s : p.value.description = s;
      }
    }), X = K({
      get: () => v.value === "add" ? $.value.parent_thesis_id : p.value.parent_thesis_id,
      set: (s) => {
        v.value === "add" ? $.value.parent_thesis_id = s : p.value.parent_thesis_id = s;
      }
    }), L = k([]);
    let ae = 0;
    function g(s, e, i) {
      const r = ae++;
      L.value.push({ id: r, type: s, title: e, message: i }), setTimeout(() => {
        H(r);
      }, 5e3);
    }
    function H(s) {
      const e = L.value.findIndex((i) => i.id === s);
      e !== -1 && L.value.splice(e, 1);
    }
    function de() {
      v.value = "add", $.value = { title: "", description: "", parent_thesis_id: null }, E.value = !0;
    }
    async function re() {
      if ($.value.title.trim())
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisMaster").insert([{
            title: $.value.title.trim(),
            description: $.value.description.trim() || null,
            parent_thesis_id: $.value.parent_thesis_id || null
          }]).select();
          if (e) throw e;
          B.invalidateQueries({ queryKey: ["thesis"] }), $.value = { title: "", description: "", parent_thesis_id: null }, E.value = !1, g("success", "Thesis Added", "New thesis has been created successfully");
        } catch (s) {
          console.error("Error adding thesis:", s), g("error", "Error", `Failed to add thesis: ${s.message}`);
        }
    }
    function ue(s) {
      p.value = {
        id: s.id,
        title: s.title,
        description: s.description || "",
        parent_thesis_id: s.parent_thesis_id || null
      }, v.value = "edit", E.value = !0;
    }
    function ce() {
      p.value = { id: "", title: "", description: "", parent_thesis_id: null }, E.value = !1;
    }
    async function he() {
      if (p.value.title.trim())
        try {
          const { error: s } = await n.schema("hf").from("thesisMaster").update({
            title: p.value.title.trim(),
            description: p.value.description.trim() || null,
            parent_thesis_id: p.value.parent_thesis_id || null
          }).eq("id", p.value.id);
          if (s) throw s;
          B.invalidateQueries({ queryKey: ["thesis"] }), p.value = { id: "", title: "", description: "", parent_thesis_id: null }, E.value = !1, g("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (s) {
          console.error("Error updating thesis:", s), g("error", "Error", `Failed to update thesis: ${s.message}`);
        }
    }
    async function ve(s, e) {
      if (confirm(`Are you sure you want to archive thesis "${e}"?

Note: This will also archive all instruments associated with this thesis.`))
        try {
          await n.schema("hf").from("thesisStocks").delete().eq("thesis_id", s);
          const { error: i } = await n.schema("hf").from("thesisMaster").delete().eq("id", s);
          if (i) throw i;
          B.invalidateQueries({ queryKey: ["thesis"] }), await I(), g("success", "Thesis Deleted", "Thesis and associated instruments have been deleted successfully");
        } catch (i) {
          console.error("Error deleting thesis:", i), g("error", "Error", `Failed to archive thesis: ${i.message}`);
        }
    }
    function Y(s, e) {
      var r;
      if (s === e) return !1;
      const i = (r = m.data.value) == null ? void 0 : r.find((A) => A.id === s);
      return i ? i.parent_thesis_id === e ? !1 : i.parent_thesis_id ? Y(i.parent_thesis_id, e) : !0 : !0;
    }
    const me = K(() => {
      if (!m.data.value) return [];
      const s = v.value === "edit" ? p.value.id : null;
      return m.data.value.filter((e) => !(s && !Y(e.id, s)));
    }), fe = K(() => {
      if (!m.data.value) return [];
      const s = m.data.value.filter((r) => !r.parent_thesis_id);
      function e(r) {
        var A;
        return ((A = m.data.value) == null ? void 0 : A.filter((R) => R.parent_thesis_id === r)) || [];
      }
      function i(r) {
        const A = e(r.id);
        return {
          ...r,
          children: A.map((R) => i(R))
        };
      }
      return s.map((r) => i(r));
    });
    function pe(s) {
      b.value = s;
    }
    return (s, e) => (a(), u("div", et, [
      N(m).isLoading.value ? (a(), u("div", tt, [...e[15] || (e[15] = [
        t("div", { class: "loading-spinner" }, null, -1),
        j(" Loading thesis... ", -1)
      ])])) : N(m).isError.value ? (a(), u("div", st, [
        e[16] || (e[16] = t("h3", null, "Error loading thesis", -1)),
        t("p", null, y(N(m).error.value), 1)
      ])) : N(m).isSuccess.value ? (a(), u("div", it, [
        t("div", nt, [
          t("h2", {
            class: O({ "thesis-header-clickable": o.showHeaderLink }),
            onClick: e[0] || (e[0] = (i) => o.showHeaderLink && _("navigate"))
          }, " Thesis Management ", 2),
          t("div", lt, [
            t("button", {
              class: "btn btn-primary",
              onClick: de
            }, [...e[17] || (e[17] = [
              t("span", { class: "icon" }, "➕", -1),
              j(" Add New Thesis ", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: e[1] || (e[1] = (i) => _("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        t("div", ot, [
          !N(m).data.value || N(m).data.value.length === 0 ? (a(), u("div", at, [...e[18] || (e[18] = [
            t("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (a(), u("div", dt, [
            (a(!0), u(F, null, q(fe.value, (i) => (a(), ee(Ze, {
              key: i.id,
              thesis: i,
              level: 0,
              "thesis-stocks": h.value,
              "expanded-thesis": D.value,
              "editing-cell": f.value,
              "editing-value": b.value,
              onToggle: c,
              onEdit: ue,
              onDelete: ve,
              onAddStock: se,
              onDeleteStock: ie,
              onStartEditCell: ne,
              onSaveEdit: le,
              onCancelEdit: Q,
              onGetCellMetadata: oe,
              onUpdateEditingValue: pe
            }, null, 8, ["thesis", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128))
          ]))
        ])
      ])) : x("", !0),
      E.value ? (a(), u("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[9] || (e[9] = (i) => E.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[8] || (e[8] = V(() => {
          }, ["stop"]))
        }, [
          t("div", rt, [
            t("h3", null, y(v.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            t("button", {
              class: "modal-close",
              onClick: e[2] || (e[2] = (i) => E.value = !1)
            }, "×")
          ]),
          t("div", ut, [
            t("div", ct, [
              t("label", {
                for: v.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, ht),
              P(t("input", {
                id: v.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[3] || (e[3] = (i) => z.value = i),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, vt), [
                [G, z.value]
              ])
            ]),
            t("div", mt, [
              t("label", {
                for: v.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, ft),
              P(t("textarea", {
                id: v.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[4] || (e[4] = (i) => W.value = i),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, pt), [
                [G, W.value]
              ])
            ]),
            t("div", yt, [
              t("label", {
                for: v.value === "add" ? "thesis-parent" : "edit-thesis-parent"
              }, " Parent Thesis ", 8, gt),
              P(t("select", {
                id: v.value === "add" ? "thesis-parent" : "edit-thesis-parent",
                "onUpdate:modelValue": e[5] || (e[5] = (i) => X.value = i)
              }, [
                e[19] || (e[19] = t("option", { value: null }, "None (Root Thesis)", -1)),
                (a(!0), u(F, null, q(me.value, (i) => (a(), u("option", {
                  key: i.id,
                  value: i.id
                }, y(i.title), 9, bt))), 128))
              ], 8, kt), [
                [ke, X.value]
              ]),
              e[20] || (e[20] = t("small", { class: "form-hint" }, "Select a parent thesis to create a hierarchical structure", -1))
            ])
          ]),
          t("div", $t, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[6] || (e[6] = (i) => v.value === "edit" ? ce() : E.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: e[7] || (e[7] = (i) => v.value === "add" ? re() : he()),
              disabled: !z.value.trim()
            }, y(v.value === "add" ? "Add Thesis" : "Save Changes"), 9, Ct)
          ])
        ])
      ])) : x("", !0),
      w.value ? (a(), u("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[14] || (e[14] = (i) => w.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[13] || (e[13] = V(() => {
          }, ["stop"]))
        }, [
          t("div", _t, [
            e[21] || (e[21] = t("h3", null, "Add Instrument to Thesis", -1)),
            t("button", {
              class: "modal-close",
              onClick: e[10] || (e[10] = (i) => w.value = !1)
            }, "×")
          ]),
          t("div", Tt, [
            t("div", wt, [
              e[22] || (e[22] = t("label", { for: "stock-symbol" }, "Instrument Symbol *", -1)),
              P(t("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[11] || (e[11] = (i) => C.value = i),
                type: "text",
                placeholder: "Enter instrument symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: S(J, ["enter"])
              }, null, 544), [
                [G, C.value]
              ])
            ])
          ]),
          t("div", Et, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[12] || (e[12] = (i) => w.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: J,
              disabled: !C.value.trim()
            }, " Add Instrument ", 8, St)
          ])
        ])
      ])) : x("", !0),
      t("div", xt, [
        be($e, {
          name: "toast",
          tag: "div"
        }, {
          default: Ce(() => [
            (a(!0), u(F, null, q(L.value, (i) => (a(), u("div", {
              key: i.id,
              class: O(["toast", `toast-${i.type}`]),
              onClick: (r) => H(i.id)
            }, [
              t("div", At, [
                i.type === "success" ? (a(), u("span", Dt, "✅")) : i.type === "error" ? (a(), u("span", Vt, "❌")) : i.type === "warning" ? (a(), u("span", Mt, "⚠️")) : i.type === "info" ? (a(), u("span", Nt, "ℹ️")) : x("", !0)
              ]),
              t("div", Ut, [
                t("div", Bt, y(i.title), 1),
                i.message ? (a(), u("div", Kt, y(i.message), 1)) : x("", !0)
              ]),
              t("button", {
                class: "toast-close",
                onClick: V((r) => H(i.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, Ft)
            ], 10, It))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Lt = /* @__PURE__ */ te(qt, [["__scopeId", "data-v-10ba14fe"]]), Ht = {
  install(l) {
    l.component("Thesis", Lt);
  }
};
export {
  Lt as Thesis,
  Ht as default
};
