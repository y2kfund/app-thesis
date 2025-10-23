import { defineComponent as se, resolveComponent as ye, createElementBlock as u, openBlock as r, normalizeClass as Y, createElementVNode as t, createCommentVNode as S, toDisplayString as f, createTextVNode as ie, withModifiers as V, Fragment as L, renderList as P, withKeys as p, createBlock as ne, ref as k, watch as pe, computed as q, unref as M, withDirectives as O, vModelText as X, vModelSelect as be, createVNode as ke, TransitionGroup as $e, withCtx as Ce } from "vue";
import { useThesisQuery as _e, useSupabase as Te } from "@y2kfund/core";
import { useQueryClient as we } from "@tanstack/vue-query";
const Ee = { class: "thesis-item" }, xe = { class: "thesis-expand-icon" }, Se = { class: "thesis-info" }, Ie = { class: "thesis-title" }, De = {
  key: 0,
  class: "thesis-parent-badge"
}, Ae = {
  key: 0,
  class: "thesis-description"
}, Ve = { class: "thesis-actions" }, Be = {
  key: 0,
  class: "stocks-section"
}, Ke = { class: "stocks-header" }, Me = { class: "stocks-table-wrapper" }, Ne = { class: "stocks-table" }, Ue = { class: "stock-symbol" }, Fe = ["onDblclick"], qe = ["value", "onBlur", "onKeyup"], Le = { key: 1 }, Pe = ["onDblclick"], Qe = ["value", "onBlur", "onKeyup"], Re = { key: 1 }, ze = ["onDblclick"], He = ["value", "onBlur", "onKeyup"], Ge = { key: 1 }, Oe = ["onDblclick"], je = ["checked", "onBlur", "onKeyup"], Je = { key: 1 }, We = ["onDblclick"], Xe = ["value", "onBlur", "onKeyup"], Ye = { key: 1 }, Ze = ["onDblclick"], et = ["checked", "onBlur", "onKeyup"], tt = { key: 1 }, st = ["onDblclick"], it = ["checked", "onBlur", "onKeyup"], nt = { key: 1 }, lt = { class: "stock-actions" }, dt = ["onClick"], at = /* @__PURE__ */ se({
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
  setup(l, { emit: N }) {
    const d = N;
    function $(m) {
      d("update-editing-value", m);
    }
    return (m, n) => {
      var w;
      const U = ye("ThesisItem", !0);
      return r(), u("div", {
        class: Y(["thesis-item-wrapper", `thesis-item-level-${l.level}`])
      }, [
        t("div", Ee, [
          t("div", {
            class: "thesis-content",
            onClick: n[0] || (n[0] = (a) => d("toggle", l.thesis.id))
          }, [
            t("div", xe, f(l.expandedThesis.has(l.thesis.id) ? "▼" : "▶"), 1),
            t("div", Se, [
              t("div", Ie, [
                ie(f(l.thesis.title) + " ", 1),
                l.thesis.parent_thesis_id ? (r(), u("span", De, " ↳ Child ")) : S("", !0)
              ]),
              l.thesis.description ? (r(), u("div", Ae, f(l.thesis.description), 1)) : S("", !0)
            ])
          ]),
          t("div", Ve, [
            t("button", {
              class: "btn btn-secondary btn-sm btn-icon",
              onClick: n[1] || (n[1] = V((a) => d("edit", l.thesis), ["stop"])),
              title: "Edit thesis"
            }, " ✏️ "),
            t("button", {
              class: "btn btn-danger btn-sm btn-icon",
              onClick: n[2] || (n[2] = V((a) => d("delete", l.thesis.id, l.thesis.title), ["stop"])),
              title: "Archive thesis"
            }, " 🗑️ ")
          ])
        ]),
        l.expandedThesis.has(l.thesis.id) ? (r(), u("div", Be, [
          t("div", Ke, [
            t("h4", null, "Instruments (" + f(((w = l.thesisStocks[l.thesis.id]) == null ? void 0 : w.length) || 0) + ")", 1),
            t("button", {
              class: "btn btn-primary btn-sm btn-icon",
              onClick: n[3] || (n[3] = V((a) => d("add-stock", l.thesis.id), ["stop"])),
              title: "Add Instrument"
            }, " ➕ ")
          ]),
          t("div", Me, [
            t("table", Ne, [
              n[28] || (n[28] = t("thead", null, [
                t("tr", null, [
                  t("th", null, "Symbol"),
                  t("th", null, "PE Ratio"),
                  t("th", null, "PEG Ratio"),
                  t("th", null, "Analyst Ratings"),
                  t("th", null, "Founder Led"),
                  t("th", null, "Next Earnings Date"),
                  t("th", null, "Passed Checks"),
                  t("th", null, "Currently Held"),
                  t("th", null, "Actions")
                ])
              ], -1)),
              t("tbody", null, [
                (r(!0), u(L, null, P(l.thesisStocks[l.thesis.id], (a) => {
                  var h, g, C, E, B, T, A, I, Q, R, F, z, H, K;
                  return r(), u("tr", {
                    key: a.id
                  }, [
                    t("td", Ue, f(a.symbol), 1),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "pe_ratio")
                    }, [
                      ((h = l.editingCell) == null ? void 0 : h.stockId) === a.id && ((g = l.editingCell) == null ? void 0 : g.field) === "pe_ratio" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[4] || (n[4] = (o) => $(o.target.valueAsNumber)),
                        onBlur: (o) => d("save-edit", a, "pe_ratio"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "pe_ratio"), ["enter"]),
                          n[5] || (n[5] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, qe)) : (r(), u("span", Le, f(a.pe_ratio ?? "-"), 1))
                    ], 40, Fe),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "peg_ratio")
                    }, [
                      ((C = l.editingCell) == null ? void 0 : C.stockId) === a.id && ((E = l.editingCell) == null ? void 0 : E.field) === "peg_ratio" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[6] || (n[6] = (o) => $(o.target.valueAsNumber)),
                        onBlur: (o) => d("save-edit", a, "peg_ratio"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "peg_ratio"), ["enter"]),
                          n[7] || (n[7] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Qe)) : (r(), u("span", Re, f(a.peg_ratio ?? "-"), 1))
                    ], 40, Pe),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "analyst_ratings")
                    }, [
                      ((B = l.editingCell) == null ? void 0 : B.stockId) === a.id && ((T = l.editingCell) == null ? void 0 : T.field) === "analyst_ratings" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "text",
                        onInput: n[8] || (n[8] = (o) => $(o.target.value)),
                        onBlur: (o) => d("save-edit", a, "analyst_ratings"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "analyst_ratings"), ["enter"]),
                          n[9] || (n[9] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, He)) : (r(), u("span", Ge, f(a.analyst_ratings || "-"), 1))
                    ], 40, ze),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "founder_led")
                    }, [
                      ((A = l.editingCell) == null ? void 0 : A.stockId) === a.id && ((I = l.editingCell) == null ? void 0 : I.field) === "founder_led" ? (r(), u("input", {
                        key: 0,
                        checked: !!l.editingValue,
                        type: "checkbox",
                        onChange: n[10] || (n[10] = (o) => $(o.target.checked)),
                        onBlur: (o) => d("save-edit", a, "founder_led"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "founder_led"), ["enter"]),
                          n[11] || (n[11] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, je)) : (r(), u("span", Je, f(a.founder_led ? "✅" : "❌"), 1))
                    ], 40, Oe),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "next_earnings_date")
                    }, [
                      ((Q = l.editingCell) == null ? void 0 : Q.stockId) === a.id && ((R = l.editingCell) == null ? void 0 : R.field) === "next_earnings_date" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "date",
                        onInput: n[12] || (n[12] = (o) => $(o.target.value)),
                        onBlur: (o) => d("save-edit", a, "next_earnings_date"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "next_earnings_date"), ["enter"]),
                          n[13] || (n[13] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Xe)) : (r(), u("span", Ye, f(a.next_earnings_date || "-"), 1))
                    ], 40, We),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "passed_checks")
                    }, [
                      ((F = l.editingCell) == null ? void 0 : F.stockId) === a.id && ((z = l.editingCell) == null ? void 0 : z.field) === "passed_checks" ? (r(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[14] || (n[14] = (o) => $(o.target.checked)),
                        onBlur: (o) => d("save-edit", a, "passed_checks"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "passed_checks"), ["enter"]),
                          n[15] || (n[15] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, et)) : (r(), u("span", tt, f(a.passed_checks ? "✅" : "❌"), 1))
                    ], 40, Ze),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (o) => d("start-edit-cell", l.thesis.id, a, "currently_held")
                    }, [
                      ((H = l.editingCell) == null ? void 0 : H.stockId) === a.id && ((K = l.editingCell) == null ? void 0 : K.field) === "currently_held" ? (r(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[16] || (n[16] = (o) => $(o.target.checked)),
                        onBlur: (o) => d("save-edit", a, "currently_held"),
                        onKeyup: [
                          p((o) => d("save-edit", a, "currently_held"), ["enter"]),
                          n[17] || (n[17] = p((o) => d("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, it)) : (r(), u("span", nt, f(a.currently_held ? "✅" : "❌"), 1))
                    ], 40, st),
                    t("td", lt, [
                      t("button", {
                        class: "btn btn-danger btn-sm btn-icon",
                        onClick: V((o) => d("delete-stock", l.thesis.id, a.id, a.symbol), ["stop"]),
                        title: "Remove instrument"
                      }, " 🗑️ ", 8, dt)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ])
        ])) : S("", !0),
        l.thesis.children && l.thesis.children.length > 0 ? (r(!0), u(L, { key: 1 }, P(l.thesis.children, (a) => (r(), ne(U, {
          key: a.id,
          thesis: a,
          level: l.level + 1,
          "thesis-stocks": l.thesisStocks,
          "expanded-thesis": l.expandedThesis,
          "editing-cell": l.editingCell,
          "editing-value": l.editingValue,
          onToggle: n[18] || (n[18] = (h) => d("toggle", h)),
          onEdit: n[19] || (n[19] = (h) => d("edit", h)),
          onDelete: n[20] || (n[20] = (h, g) => d("delete", h, g)),
          onAddStock: n[21] || (n[21] = (h) => d("add-stock", h)),
          onDeleteStock: n[22] || (n[22] = (h, g, C) => d("delete-stock", h, g, C)),
          onStartEditCell: n[23] || (n[23] = (h, g, C) => d("start-edit-cell", h, g, C)),
          onSaveEdit: n[24] || (n[24] = (h, g) => d("save-edit", h, g)),
          onCancelEdit: n[25] || (n[25] = () => d("cancel-edit")),
          onGetCellMetadata: n[26] || (n[26] = (h, g) => d("get-cell-metadata", h, g)),
          onUpdateEditingValue: n[27] || (n[27] = (h) => d("update-editing-value", h))
        }, null, 8, ["thesis", "level", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128)) : S("", !0)
      ], 2);
    };
  }
}), le = (l, N) => {
  const d = l.__vccOpts || l;
  for (const [$, m] of N)
    d[$] = m;
  return d;
}, ot = /* @__PURE__ */ le(at, [["__scopeId", "data-v-99d2dbe1"]]), rt = { class: "thesis-card" }, ut = {
  key: 0,
  class: "loading"
}, ct = {
  key: 1,
  class: "error"
}, ht = {
  key: 2,
  class: "thesis-container"
}, vt = { class: "thesis-header" }, mt = { class: "thesis-header-actions" }, ft = { class: "thesis-list" }, gt = {
  key: 0,
  class: "thesis-empty"
}, yt = {
  key: 1,
  class: "thesis-items"
}, pt = { class: "modal-header" }, bt = { class: "modal-body" }, kt = { class: "form-group" }, $t = ["for"], Ct = ["id"], _t = { class: "form-group" }, Tt = ["for"], wt = ["id"], Et = { class: "form-group" }, xt = ["for"], St = ["id"], It = ["value"], Dt = { class: "modal-footer" }, At = ["disabled"], Vt = { class: "modal-header" }, Bt = { class: "modal-body" }, Kt = { class: "form-group" }, Mt = { class: "modal-footer" }, Nt = ["disabled"], Ut = { class: "toast-container" }, Ft = ["onClick"], qt = { class: "toast-icon" }, Lt = { key: 0 }, Pt = { key: 1 }, Qt = { key: 2 }, Rt = { key: 3 }, zt = { class: "toast-content" }, Ht = { class: "toast-title" }, Gt = {
  key: 0,
  class: "toast-message"
}, Ot = ["onClick"], jt = /* @__PURE__ */ se({
  __name: "Thesis",
  props: {
    userId: { default: null },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(l, { emit: N }) {
    const d = l, $ = N, m = _e(), n = Te(), U = we(), w = k("");
    async function a() {
      var s;
      try {
        const { data: { user: e } } = await n.auth.getUser();
        e != null && e.email ? w.value = e.email : (s = e == null ? void 0 : e.user_metadata) != null && s.name ? w.value = e.user_metadata.name : d.userId && (w.value = d.userId);
      } catch (e) {
        console.error("Error fetching current user:", e), d.userId && (w.value = d.userId);
      }
    }
    a();
    const h = k({}), g = k(null), C = k(null), E = k(!1), B = k(""), T = k(""), A = k(/* @__PURE__ */ new Set());
    async function I() {
      try {
        const { data: s, error: e } = await n.schema("hf").from("thesisStocks").select("*").order("symbol");
        if (e) throw e;
        const i = {};
        s == null || s.forEach((c) => {
          i[c.thesis_id] || (i[c.thesis_id] = []), i[c.thesis_id].push(c);
        }), h.value = i;
      } catch (s) {
        console.error("Error loading thesis stocks:", s), b("error", "Error", `Failed to load instruments: ${s.message}`);
      }
    }
    pe(() => m.data.value, (s) => {
      s && s.length > 0 && I();
    }, { immediate: !0 });
    function Q(s) {
      A.value.has(s) ? A.value.delete(s) : A.value.add(s);
    }
    function R(s) {
      B.value = s, T.value = "", E.value = !0;
    }
    async function F() {
      if (!(!T.value.trim() || !B.value))
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisStocks").insert([{
            thesis_id: B.value,
            symbol: T.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1,
            analyst_ratings: "",
            founder_led: !1,
            next_earnings_date: null
          }]).select();
          if (e) throw e;
          await I(), T.value = "", E.value = !1, b("success", "Instrument Added", `${T.value} has been added to the thesis`);
        } catch (s) {
          console.error("Error adding stock:", s), b("error", "Error", `Failed to add instrument: ${s.message}`);
        }
    }
    async function z(s, e, i) {
      if (confirm(`Are you sure you want to remove ${i} from this thesis?`))
        try {
          const { error: c } = await n.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (c) throw c;
          await I(), b("success", "Instrument Removed", `${i} has been removed from the thesis`);
        } catch (c) {
          console.error("Error deleting stock:", c), b("error", "Error", `Failed to remove stock: ${c.message}`);
        }
    }
    function H(s, e, i) {
      g.value = { thesisId: s, stockId: e.id, field: i }, C.value = e[i];
    }
    function K() {
      g.value = null, C.value = null;
    }
    async function o(s, e) {
      if (g.value) {
        if (!w.value) {
          b("error", "Error", "User information not available"), K();
          return;
        }
        try {
          const i = {
            [e]: C.value,
            [`${e}_updated_by`]: w.value,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: c } = await n.schema("hf").from("thesisStocks").update(i).eq("id", s.id);
          if (c) throw c;
          await I(), K(), b("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (i) {
          console.error("Error updating stock:", i), b("error", "Error", `Failed to update: ${i.message}`);
        }
      }
    }
    function de(s, e) {
      const i = s[`${e}_updated_by`], c = s[`${e}_updated_at`];
      if (i && c) {
        const D = new Date(c).toLocaleString();
        return `Updated by: ${i}
Updated at: ${D}`;
      }
      return "No updates yet";
    }
    const x = k(!1), v = k("add"), _ = k({ title: "", description: "", parent_thesis_id: null }), y = k({ id: "", title: "", description: "", parent_thesis_id: null }), j = q({
      get: () => v.value === "add" ? _.value.title : y.value.title,
      set: (s) => {
        v.value === "add" ? _.value.title = s : y.value.title = s;
      }
    }), Z = q({
      get: () => v.value === "add" ? _.value.description : y.value.description,
      set: (s) => {
        v.value === "add" ? _.value.description = s : y.value.description = s;
      }
    }), ee = q({
      get: () => v.value === "add" ? _.value.parent_thesis_id : y.value.parent_thesis_id,
      set: (s) => {
        v.value === "add" ? _.value.parent_thesis_id = s : y.value.parent_thesis_id = s;
      }
    }), G = k([]);
    let ae = 0;
    function b(s, e, i) {
      const c = ae++;
      G.value.push({ id: c, type: s, title: e, message: i }), setTimeout(() => {
        J(c);
      }, 5e3);
    }
    function J(s) {
      const e = G.value.findIndex((i) => i.id === s);
      e !== -1 && G.value.splice(e, 1);
    }
    function oe() {
      v.value = "add", _.value = { title: "", description: "", parent_thesis_id: null }, x.value = !0;
    }
    async function re() {
      if (_.value.title.trim())
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisMaster").insert([{
            title: _.value.title.trim(),
            description: _.value.description.trim() || null,
            parent_thesis_id: _.value.parent_thesis_id || null
          }]).select();
          if (e) throw e;
          U.invalidateQueries({ queryKey: ["thesis"] }), _.value = { title: "", description: "", parent_thesis_id: null }, x.value = !1, b("success", "Thesis Added", "New thesis has been created successfully");
        } catch (s) {
          console.error("Error adding thesis:", s), b("error", "Error", `Failed to add thesis: ${s.message}`);
        }
    }
    function ue(s) {
      y.value = {
        id: s.id,
        title: s.title,
        description: s.description || "",
        parent_thesis_id: s.parent_thesis_id || null
      }, v.value = "edit", x.value = !0;
    }
    function ce() {
      y.value = { id: "", title: "", description: "", parent_thesis_id: null }, x.value = !1;
    }
    async function he() {
      if (y.value.title.trim())
        try {
          const { error: s } = await n.schema("hf").from("thesisMaster").update({
            title: y.value.title.trim(),
            description: y.value.description.trim() || null,
            parent_thesis_id: y.value.parent_thesis_id || null
          }).eq("id", y.value.id);
          if (s) throw s;
          U.invalidateQueries({ queryKey: ["thesis"] }), y.value = { id: "", title: "", description: "", parent_thesis_id: null }, x.value = !1, b("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (s) {
          console.error("Error updating thesis:", s), b("error", "Error", `Failed to update thesis: ${s.message}`);
        }
    }
    async function ve(s, e) {
      if (confirm(`Are you sure you want to archive thesis "${e}"?

Note: This will also archive all instruments associated with this thesis.`))
        try {
          await n.schema("hf").from("thesisStocks").delete().eq("thesis_id", s);
          const { error: i } = await n.schema("hf").from("thesisMaster").delete().eq("id", s);
          if (i) throw i;
          U.invalidateQueries({ queryKey: ["thesis"] }), await I(), b("success", "Thesis Deleted", "Thesis and associated instruments have been deleted successfully");
        } catch (i) {
          console.error("Error deleting thesis:", i), b("error", "Error", `Failed to archive thesis: ${i.message}`);
        }
    }
    function te(s, e) {
      var c;
      if (s === e) return !1;
      const i = (c = m.data.value) == null ? void 0 : c.find((D) => D.id === s);
      return i ? i.parent_thesis_id === e ? !1 : i.parent_thesis_id ? te(i.parent_thesis_id, e) : !0 : !0;
    }
    const me = q(() => {
      if (!m.data.value) return [];
      const s = v.value === "edit" ? y.value.id : null;
      return m.data.value.filter((e) => !(s && !te(e.id, s)));
    }), fe = q(() => {
      if (!m.data.value) return [];
      const s = m.data.value.filter((c) => !c.parent_thesis_id);
      function e(c) {
        var D;
        return ((D = m.data.value) == null ? void 0 : D.filter((W) => W.parent_thesis_id === c)) || [];
      }
      function i(c) {
        const D = e(c.id);
        return {
          ...c,
          children: D.map((W) => i(W))
        };
      }
      return s.map((c) => i(c));
    });
    function ge(s) {
      C.value = s;
    }
    return (s, e) => (r(), u("div", rt, [
      M(m).isLoading.value ? (r(), u("div", ut, [...e[15] || (e[15] = [
        t("div", { class: "loading-spinner" }, null, -1),
        ie(" Loading thesis... ", -1)
      ])])) : M(m).isError.value ? (r(), u("div", ct, [
        e[16] || (e[16] = t("h3", null, "Error loading thesis", -1)),
        t("p", null, f(M(m).error.value), 1)
      ])) : M(m).isSuccess.value ? (r(), u("div", ht, [
        t("div", vt, [
          t("h2", {
            class: Y({ "thesis-header-clickable": d.showHeaderLink }),
            onClick: e[0] || (e[0] = (i) => d.showHeaderLink && $("navigate"))
          }, " Thesis Management ", 2),
          t("div", mt, [
            t("button", {
              class: "btn btn-add",
              onClick: oe
            }, [...e[17] || (e[17] = [
              t("span", { class: "icon" }, "➕", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: e[1] || (e[1] = (i) => $("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        t("div", ft, [
          !M(m).data.value || M(m).data.value.length === 0 ? (r(), u("div", gt, [...e[18] || (e[18] = [
            t("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (r(), u("div", yt, [
            (r(!0), u(L, null, P(fe.value, (i) => (r(), ne(ot, {
              key: i.id,
              thesis: i,
              level: 0,
              "thesis-stocks": h.value,
              "expanded-thesis": A.value,
              "editing-cell": g.value,
              "editing-value": C.value,
              onToggle: Q,
              onEdit: ue,
              onDelete: ve,
              onAddStock: R,
              onDeleteStock: z,
              onStartEditCell: H,
              onSaveEdit: o,
              onCancelEdit: K,
              onGetCellMetadata: de,
              onUpdateEditingValue: ge
            }, null, 8, ["thesis", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128))
          ]))
        ])
      ])) : S("", !0),
      x.value ? (r(), u("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[9] || (e[9] = (i) => x.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[8] || (e[8] = V(() => {
          }, ["stop"]))
        }, [
          t("div", pt, [
            t("h3", null, f(v.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            t("button", {
              class: "modal-close",
              onClick: e[2] || (e[2] = (i) => x.value = !1)
            }, "×")
          ]),
          t("div", bt, [
            t("div", kt, [
              t("label", {
                for: v.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, $t),
              O(t("input", {
                id: v.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[3] || (e[3] = (i) => j.value = i),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, Ct), [
                [X, j.value]
              ])
            ]),
            t("div", _t, [
              t("label", {
                for: v.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, Tt),
              O(t("textarea", {
                id: v.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[4] || (e[4] = (i) => Z.value = i),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, wt), [
                [X, Z.value]
              ])
            ]),
            t("div", Et, [
              t("label", {
                for: v.value === "add" ? "thesis-parent" : "edit-thesis-parent"
              }, " Parent Thesis ", 8, xt),
              O(t("select", {
                id: v.value === "add" ? "thesis-parent" : "edit-thesis-parent",
                "onUpdate:modelValue": e[5] || (e[5] = (i) => ee.value = i)
              }, [
                e[19] || (e[19] = t("option", { value: null }, "None (Root Thesis)", -1)),
                (r(!0), u(L, null, P(me.value, (i) => (r(), u("option", {
                  key: i.id,
                  value: i.id
                }, f(i.title), 9, It))), 128))
              ], 8, St), [
                [be, ee.value]
              ]),
              e[20] || (e[20] = t("small", { class: "form-hint" }, "Select a parent thesis to create a hierarchical structure", -1))
            ])
          ]),
          t("div", Dt, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[6] || (e[6] = (i) => v.value === "edit" ? ce() : x.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: e[7] || (e[7] = (i) => v.value === "add" ? re() : he()),
              disabled: !j.value.trim()
            }, f(v.value === "add" ? "Add Thesis" : "Save Changes"), 9, At)
          ])
        ])
      ])) : S("", !0),
      E.value ? (r(), u("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[14] || (e[14] = (i) => E.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[13] || (e[13] = V(() => {
          }, ["stop"]))
        }, [
          t("div", Vt, [
            e[21] || (e[21] = t("h3", null, "Add Instrument to Thesis", -1)),
            t("button", {
              class: "modal-close",
              onClick: e[10] || (e[10] = (i) => E.value = !1)
            }, "×")
          ]),
          t("div", Bt, [
            t("div", Kt, [
              e[22] || (e[22] = t("label", { for: "stock-symbol" }, "Instrument Symbol *", -1)),
              O(t("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[11] || (e[11] = (i) => T.value = i),
                type: "text",
                placeholder: "Enter instrument symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: p(F, ["enter"])
              }, null, 544), [
                [X, T.value]
              ])
            ])
          ]),
          t("div", Mt, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[12] || (e[12] = (i) => E.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: F,
              disabled: !T.value.trim()
            }, " Add Instrument ", 8, Nt)
          ])
        ])
      ])) : S("", !0),
      t("div", Ut, [
        ke($e, {
          name: "toast",
          tag: "div"
        }, {
          default: Ce(() => [
            (r(!0), u(L, null, P(G.value, (i) => (r(), u("div", {
              key: i.id,
              class: Y(["toast", `toast-${i.type}`]),
              onClick: (c) => J(i.id)
            }, [
              t("div", qt, [
                i.type === "success" ? (r(), u("span", Lt, "✅")) : i.type === "error" ? (r(), u("span", Pt, "❌")) : i.type === "warning" ? (r(), u("span", Qt, "⚠️")) : i.type === "info" ? (r(), u("span", Rt, "ℹ️")) : S("", !0)
              ]),
              t("div", zt, [
                t("div", Ht, f(i.title), 1),
                i.message ? (r(), u("div", Gt, f(i.message), 1)) : S("", !0)
              ]),
              t("button", {
                class: "toast-close",
                onClick: V((c) => J(i.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, Ot)
            ], 10, Ft))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Jt = /* @__PURE__ */ le(jt, [["__scopeId", "data-v-e6855fcc"]]), Zt = {
  install(l) {
    l.component("Thesis", Jt);
  }
};
export {
  Jt as Thesis,
  Zt as default
};
