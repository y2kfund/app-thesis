import { defineComponent as oe, resolveComponent as xe, createElementBlock as u, openBlock as r, normalizeClass as Z, createElementVNode as t, createCommentVNode as T, toDisplayString as m, createTextVNode as de, withModifiers as U, Fragment as R, renderList as q, withKeys as b, createBlock as re, ref as g, onMounted as Se, watch as ae, computed as L, unref as N, withDirectives as P, vModelText as j, vModelSelect as Ie, createVNode as Ae, TransitionGroup as De, withCtx as Ue } from "vue";
import { useThesisQuery as Ve, useSupabase as Ne } from "@y2kfund/core";
import { useQueryClient as Be } from "@tanstack/vue-query";
const Me = { class: "thesis-item" }, Ke = { class: "thesis-expand-icon" }, Fe = { class: "thesis-info" }, Le = { class: "thesis-title" }, Pe = {
  key: 0,
  class: "thesis-parent-badge"
}, Re = {
  key: 0,
  class: "thesis-description"
}, qe = { class: "thesis-actions" }, ze = {
  key: 0,
  class: "stocks-section"
}, Qe = { class: "stocks-header" }, He = { class: "stocks-table-wrapper" }, Ge = { class: "stocks-table" }, Oe = { class: "stock-symbol" }, je = ["onDblclick"], Xe = ["value", "onBlur", "onKeyup"], Je = { key: 1 }, We = ["onDblclick"], Ye = ["value", "onBlur", "onKeyup"], Ze = { key: 1 }, et = ["onDblclick"], tt = ["value", "onBlur", "onKeyup"], st = { key: 1 }, it = ["onDblclick"], nt = ["checked", "onBlur", "onKeyup"], lt = { key: 1 }, at = ["onDblclick"], ot = ["value", "onBlur", "onKeyup"], dt = { key: 1 }, rt = ["onDblclick"], ut = ["checked", "onBlur", "onKeyup"], ct = { key: 1 }, ht = ["onDblclick"], vt = ["checked", "onBlur", "onKeyup"], mt = { key: 1 }, pt = { class: "stock-actions" }, ft = ["onClick"], gt = /* @__PURE__ */ oe({
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
  setup(l, { emit: B }) {
    const a = B;
    function $(p) {
      a("update-editing-value", p);
    }
    return (p, n) => {
      var E;
      const M = xe("ThesisItem", !0);
      return r(), u("div", {
        class: Z(["thesis-item-wrapper", `thesis-item-level-${l.level}`])
      }, [
        t("div", Me, [
          t("div", {
            class: "thesis-content",
            onClick: n[0] || (n[0] = (o) => a("toggle", l.thesis.id))
          }, [
            t("div", Ke, m(l.expandedThesis.has(l.thesis.id) ? "▼" : "▶"), 1),
            t("div", Fe, [
              t("div", Le, [
                de(m(l.thesis.title) + " ", 1),
                l.thesis.parent_thesis_id ? (r(), u("span", Pe, " ↳ Child ")) : T("", !0)
              ]),
              l.thesis.description ? (r(), u("div", Re, m(l.thesis.description), 1)) : T("", !0)
            ])
          ]),
          t("div", qe, [
            t("button", {
              class: "btn btn-secondary btn-sm btn-icon",
              onClick: n[1] || (n[1] = U((o) => a("edit", l.thesis), ["stop"])),
              title: "Edit thesis"
            }, " ✏️ "),
            t("button", {
              class: "btn btn-danger btn-sm btn-icon",
              onClick: n[2] || (n[2] = U((o) => a("delete", l.thesis.id, l.thesis.title), ["stop"])),
              title: "Archive thesis"
            }, " 🗑️ ")
          ])
        ]),
        l.expandedThesis.has(l.thesis.id) ? (r(), u("div", ze, [
          t("div", Qe, [
            t("h4", null, "Instruments (" + m(((E = l.thesisStocks[l.thesis.id]) == null ? void 0 : E.length) || 0) + ")", 1),
            t("button", {
              class: "btn btn-primary btn-sm btn-icon",
              onClick: n[3] || (n[3] = U((o) => a("add-stock", l.thesis.id), ["stop"])),
              title: "Add Instrument"
            }, " ➕ ")
          ]),
          t("div", He, [
            t("table", Ge, [
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
                (r(!0), u(R, null, q(l.thesisStocks[l.thesis.id], (o) => {
                  var h, f, _, K, z, Q, H, G, F, D, I, x, V, C;
                  return r(), u("tr", {
                    key: o.id
                  }, [
                    t("td", Oe, m(o.symbol), 1),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "pe_ratio")
                    }, [
                      ((h = l.editingCell) == null ? void 0 : h.stockId) === o.id && ((f = l.editingCell) == null ? void 0 : f.field) === "pe_ratio" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[4] || (n[4] = (d) => $(d.target.valueAsNumber)),
                        onBlur: (d) => a("save-edit", o, "pe_ratio"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "pe_ratio"), ["enter"]),
                          n[5] || (n[5] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Xe)) : (r(), u("span", Je, m(o.pe_ratio ?? "-"), 1))
                    ], 40, je),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "peg_ratio")
                    }, [
                      ((_ = l.editingCell) == null ? void 0 : _.stockId) === o.id && ((K = l.editingCell) == null ? void 0 : K.field) === "peg_ratio" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[6] || (n[6] = (d) => $(d.target.valueAsNumber)),
                        onBlur: (d) => a("save-edit", o, "peg_ratio"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "peg_ratio"), ["enter"]),
                          n[7] || (n[7] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Ye)) : (r(), u("span", Ze, m(o.peg_ratio ?? "-"), 1))
                    ], 40, We),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "analyst_ratings")
                    }, [
                      ((z = l.editingCell) == null ? void 0 : z.stockId) === o.id && ((Q = l.editingCell) == null ? void 0 : Q.field) === "analyst_ratings" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "text",
                        onInput: n[8] || (n[8] = (d) => $(d.target.value)),
                        onBlur: (d) => a("save-edit", o, "analyst_ratings"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "analyst_ratings"), ["enter"]),
                          n[9] || (n[9] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, tt)) : (r(), u("span", st, m(o.analyst_ratings || "-"), 1))
                    ], 40, et),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "founder_led")
                    }, [
                      ((H = l.editingCell) == null ? void 0 : H.stockId) === o.id && ((G = l.editingCell) == null ? void 0 : G.field) === "founder_led" ? (r(), u("input", {
                        key: 0,
                        checked: !!l.editingValue,
                        type: "checkbox",
                        onChange: n[10] || (n[10] = (d) => $(d.target.checked)),
                        onBlur: (d) => a("save-edit", o, "founder_led"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "founder_led"), ["enter"]),
                          n[11] || (n[11] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, nt)) : (r(), u("span", lt, m(o.founder_led ? "✅" : "❌"), 1))
                    ], 40, it),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "next_earnings_date")
                    }, [
                      ((F = l.editingCell) == null ? void 0 : F.stockId) === o.id && ((D = l.editingCell) == null ? void 0 : D.field) === "next_earnings_date" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "date",
                        onInput: n[12] || (n[12] = (d) => $(d.target.value)),
                        onBlur: (d) => a("save-edit", o, "next_earnings_date"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "next_earnings_date"), ["enter"]),
                          n[13] || (n[13] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, ot)) : (r(), u("span", dt, m(o.next_earnings_date || "-"), 1))
                    ], 40, at),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "passed_checks")
                    }, [
                      ((I = l.editingCell) == null ? void 0 : I.stockId) === o.id && ((x = l.editingCell) == null ? void 0 : x.field) === "passed_checks" ? (r(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[14] || (n[14] = (d) => $(d.target.checked)),
                        onBlur: (d) => a("save-edit", o, "passed_checks"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "passed_checks"), ["enter"]),
                          n[15] || (n[15] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, ut)) : (r(), u("span", ct, m(o.passed_checks ? "✅" : "❌"), 1))
                    ], 40, rt),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (d) => a("start-edit-cell", l.thesis.id, o, "currently_held")
                    }, [
                      ((V = l.editingCell) == null ? void 0 : V.stockId) === o.id && ((C = l.editingCell) == null ? void 0 : C.field) === "currently_held" ? (r(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[16] || (n[16] = (d) => $(d.target.checked)),
                        onBlur: (d) => a("save-edit", o, "currently_held"),
                        onKeyup: [
                          b((d) => a("save-edit", o, "currently_held"), ["enter"]),
                          n[17] || (n[17] = b((d) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, vt)) : (r(), u("span", mt, m(o.currently_held ? "✅" : "❌"), 1))
                    ], 40, ht),
                    t("td", pt, [
                      t("button", {
                        class: "btn btn-danger btn-sm btn-icon",
                        onClick: U((d) => a("delete-stock", l.thesis.id, o.id, o.symbol), ["stop"]),
                        title: "Remove instrument"
                      }, " 🗑️ ", 8, ft)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ])
        ])) : T("", !0),
        l.thesis.children && l.thesis.children.length > 0 ? (r(!0), u(R, { key: 1 }, q(l.thesis.children, (o) => (r(), re(M, {
          key: o.id,
          thesis: o,
          level: l.level + 1,
          "thesis-stocks": l.thesisStocks,
          "expanded-thesis": l.expandedThesis,
          "editing-cell": l.editingCell,
          "editing-value": l.editingValue,
          onToggle: n[18] || (n[18] = (h) => a("toggle", h)),
          onEdit: n[19] || (n[19] = (h) => a("edit", h)),
          onDelete: n[20] || (n[20] = (h, f) => a("delete", h, f)),
          onAddStock: n[21] || (n[21] = (h) => a("add-stock", h)),
          onDeleteStock: n[22] || (n[22] = (h, f, _) => a("delete-stock", h, f, _)),
          onStartEditCell: n[23] || (n[23] = (h, f, _) => a("start-edit-cell", h, f, _)),
          onSaveEdit: n[24] || (n[24] = (h, f) => a("save-edit", h, f)),
          onCancelEdit: n[25] || (n[25] = () => a("cancel-edit")),
          onGetCellMetadata: n[26] || (n[26] = (h, f) => a("get-cell-metadata", h, f)),
          onUpdateEditingValue: n[27] || (n[27] = (h) => a("update-editing-value", h))
        }, null, 8, ["thesis", "level", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128)) : T("", !0)
      ], 2);
    };
  }
}), ue = (l, B) => {
  const a = l.__vccOpts || l;
  for (const [$, p] of B)
    a[$] = p;
  return a;
}, yt = /* @__PURE__ */ ue(gt, [["__scopeId", "data-v-99d2dbe1"]]), bt = { class: "thesis-card" }, kt = {
  key: 0,
  class: "loading"
}, $t = {
  key: 1,
  class: "error"
}, wt = {
  key: 2,
  class: "thesis-container"
}, _t = { class: "thesis-header" }, Ct = { class: "thesis-header-actions" }, Tt = { class: "thesis-list" }, Et = {
  key: 0,
  class: "thesis-empty"
}, xt = {
  key: 1,
  class: "thesis-items"
}, St = { class: "modal-header" }, It = { class: "modal-body" }, At = { class: "form-group" }, Dt = ["for"], Ut = ["id"], Vt = { class: "form-group" }, Nt = ["for"], Bt = ["id"], Mt = { class: "form-group" }, Kt = ["for"], Ft = ["id"], Lt = ["value"], Pt = { class: "modal-footer" }, Rt = ["disabled"], qt = { class: "modal-header" }, zt = { class: "modal-body" }, Qt = { class: "form-group" }, Ht = { class: "modal-footer" }, Gt = ["disabled"], Ot = { class: "toast-container" }, jt = ["onClick"], Xt = { class: "toast-icon" }, Jt = { key: 0 }, Wt = { key: 1 }, Yt = { key: 2 }, Zt = { key: 3 }, es = { class: "toast-content" }, ts = { class: "toast-title" }, ss = {
  key: 0,
  class: "toast-message"
}, is = ["onClick"], ns = {
  key: 5,
  class: "rename-dialog-backdrop"
}, ls = { class: "rename-dialog" }, as = { class: "dialog-actions" }, os = /* @__PURE__ */ oe({
  __name: "Thesis",
  props: {
    userId: { default: null },
    showHeaderLink: { type: Boolean, default: !1 },
    window: { default: null }
  },
  emits: ["minimize", "navigate"],
  setup(l, { emit: B }) {
    const a = l, $ = B, p = Ve(), n = Ne(), M = Be(), E = g(""), o = g(/* @__PURE__ */ new Set()), h = g("Thesis Management"), f = g(!1), _ = g("");
    function K() {
      return new URL(window.location.href).searchParams.get(`${a.window}_thesis_app_name`) || "Thesis Management";
    }
    function z(s) {
      const e = new URL(window.location.href);
      s && s.trim() && s !== "Thesis Management" ? e.searchParams.set(`${a.window}_thesis_app_name`, s.trim()) : e.searchParams.delete(`${a.window}_thesis_app_name`), window.history.replaceState({}, "", e.toString());
    }
    function Q() {
      _.value = h.value, f.value = !0;
    }
    function H() {
      h.value = _.value.trim() || "Thesis Management", z(h.value), f.value = !1;
    }
    Se(() => {
      h.value = K(), o.value = ne(), window.addEventListener("popstate", () => {
        h.value = K(), o.value = ne();
      });
    }), ae(o, (s) => {
      le(s);
    }, { deep: !0 });
    async function G() {
      var s;
      try {
        const { data: { user: e } } = await n.auth.getUser();
        e != null && e.email ? E.value = e.email : (s = e == null ? void 0 : e.user_metadata) != null && s.name ? E.value = e.user_metadata.name : a.userId && (E.value = a.userId);
      } catch (e) {
        console.error("Error fetching current user:", e), a.userId && (E.value = a.userId);
      }
    }
    G();
    const F = g({}), D = g(null), I = g(null), x = g(!1), V = g(""), C = g("");
    async function d() {
      try {
        const { data: s, error: e } = await n.schema("hf").from("thesisStocks").select("*").order("symbol");
        if (e) throw e;
        const i = {};
        s == null || s.forEach((c) => {
          i[c.thesis_id] || (i[c.thesis_id] = []), i[c.thesis_id].push(c);
        }), F.value = i;
      } catch (s) {
        console.error("Error loading thesis stocks:", s), k("error", "Error", `Failed to load instruments: ${s.message}`);
      }
    }
    ae(() => p.data.value, (s) => {
      s && s.length > 0 && d();
    }, { immediate: !0 });
    function ce(s) {
      o.value.has(s) ? o.value.delete(s) : o.value.add(s), le(o.value);
    }
    function he(s) {
      V.value = s, C.value = "", x.value = !0;
    }
    async function ee() {
      if (!(!C.value.trim() || !V.value))
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisStocks").insert([{
            thesis_id: V.value,
            symbol: C.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1,
            analyst_ratings: "",
            founder_led: !1,
            next_earnings_date: null
          }]).select();
          if (e) throw e;
          await d(), C.value = "", x.value = !1, k("success", "Instrument Added", `${C.value} has been added to the thesis`);
        } catch (s) {
          console.error("Error adding stock:", s), k("error", "Error", `Failed to add instrument: ${s.message}`);
        }
    }
    async function ve(s, e, i) {
      if (confirm(`Are you sure you want to remove ${i} from this thesis?`))
        try {
          const { error: c } = await n.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (c) throw c;
          await d(), k("success", "Instrument Removed", `${i} has been removed from the thesis`);
        } catch (c) {
          console.error("Error deleting stock:", c), k("error", "Error", `Failed to remove stock: ${c.message}`);
        }
    }
    function me(s, e, i) {
      D.value = { thesisId: s, stockId: e.id, field: i }, I.value = e[i];
    }
    function X() {
      D.value = null, I.value = null;
    }
    async function pe(s, e) {
      if (D.value) {
        if (!E.value) {
          k("error", "Error", "User information not available"), X();
          return;
        }
        try {
          const i = {
            [e]: I.value,
            [`${e}_updated_by`]: E.value,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: c } = await n.schema("hf").from("thesisStocks").update(i).eq("id", s.id);
          if (c) throw c;
          await d(), X(), k("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (i) {
          console.error("Error updating stock:", i), k("error", "Error", `Failed to update: ${i.message}`);
        }
      }
    }
    function fe(s, e) {
      const i = s[`${e}_updated_by`], c = s[`${e}_updated_at`];
      if (i && c) {
        const A = new Date(c).toLocaleString();
        return `Updated by: ${i}
Updated at: ${A}`;
      }
      return "No updates yet";
    }
    const S = g(!1), v = g("add"), w = g({ title: "", description: "", parent_thesis_id: null }), y = g({ id: "", title: "", description: "", parent_thesis_id: null }), J = L({
      get: () => v.value === "add" ? w.value.title : y.value.title,
      set: (s) => {
        v.value === "add" ? w.value.title = s : y.value.title = s;
      }
    }), te = L({
      get: () => v.value === "add" ? w.value.description : y.value.description,
      set: (s) => {
        v.value === "add" ? w.value.description = s : y.value.description = s;
      }
    }), se = L({
      get: () => v.value === "add" ? w.value.parent_thesis_id : y.value.parent_thesis_id,
      set: (s) => {
        v.value === "add" ? w.value.parent_thesis_id = s : y.value.parent_thesis_id = s;
      }
    }), O = g([]);
    let ge = 0;
    function k(s, e, i) {
      const c = ge++;
      O.value.push({ id: c, type: s, title: e, message: i }), setTimeout(() => {
        W(c);
      }, 5e3);
    }
    function W(s) {
      const e = O.value.findIndex((i) => i.id === s);
      e !== -1 && O.value.splice(e, 1);
    }
    function ye() {
      v.value = "add", w.value = { title: "", description: "", parent_thesis_id: null }, S.value = !0;
    }
    async function be() {
      if (w.value.title.trim())
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisMaster").insert([{
            title: w.value.title.trim(),
            description: w.value.description.trim() || null,
            parent_thesis_id: w.value.parent_thesis_id || null
          }]).select();
          if (e) throw e;
          M.invalidateQueries({ queryKey: ["thesis"] }), w.value = { title: "", description: "", parent_thesis_id: null }, S.value = !1, k("success", "Thesis Added", "New thesis has been created successfully");
        } catch (s) {
          console.error("Error adding thesis:", s), k("error", "Error", `Failed to add thesis: ${s.message}`);
        }
    }
    function ke(s) {
      y.value = {
        id: s.id,
        title: s.title,
        description: s.description || "",
        parent_thesis_id: s.parent_thesis_id || null
      }, v.value = "edit", S.value = !0;
    }
    function $e() {
      y.value = { id: "", title: "", description: "", parent_thesis_id: null }, S.value = !1;
    }
    async function we() {
      if (y.value.title.trim())
        try {
          const { error: s } = await n.schema("hf").from("thesisMaster").update({
            title: y.value.title.trim(),
            description: y.value.description.trim() || null,
            parent_thesis_id: y.value.parent_thesis_id || null
          }).eq("id", y.value.id);
          if (s) throw s;
          M.invalidateQueries({ queryKey: ["thesis"] }), y.value = { id: "", title: "", description: "", parent_thesis_id: null }, S.value = !1, k("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (s) {
          console.error("Error updating thesis:", s), k("error", "Error", `Failed to update thesis: ${s.message}`);
        }
    }
    async function _e(s, e) {
      if (confirm(`Are you sure you want to archive thesis "${e}"?

Note: This will also archive all instruments associated with this thesis.`))
        try {
          await n.schema("hf").from("thesisStocks").delete().eq("thesis_id", s);
          const { error: i } = await n.schema("hf").from("thesisMaster").delete().eq("id", s);
          if (i) throw i;
          M.invalidateQueries({ queryKey: ["thesis"] }), await d(), k("success", "Thesis Deleted", "Thesis and associated instruments have been deleted successfully");
        } catch (i) {
          console.error("Error deleting thesis:", i), k("error", "Error", `Failed to archive thesis: ${i.message}`);
        }
    }
    function ie(s, e) {
      var c;
      if (s === e) return !1;
      const i = (c = p.data.value) == null ? void 0 : c.find((A) => A.id === s);
      return i ? i.parent_thesis_id === e ? !1 : i.parent_thesis_id ? ie(i.parent_thesis_id, e) : !0 : !0;
    }
    const Ce = L(() => {
      if (!p.data.value) return [];
      const s = v.value === "edit" ? y.value.id : null;
      return p.data.value.filter((e) => !(s && !ie(e.id, s)));
    }), Te = L(() => {
      if (!p.data.value) return [];
      const s = p.data.value.filter((c) => !c.parent_thesis_id);
      function e(c) {
        var A;
        return ((A = p.data.value) == null ? void 0 : A.filter((Y) => Y.parent_thesis_id === c)) || [];
      }
      function i(c) {
        const A = e(c.id);
        return {
          ...c,
          children: A.map((Y) => i(Y))
        };
      }
      return s.map((c) => i(c));
    });
    function Ee(s) {
      I.value = s;
    }
    function ne() {
      const e = new URL(window.location.href).searchParams.get(`${a.window}_expanded_thesis`);
      return e ? new Set(e.split(",").filter(Boolean)) : /* @__PURE__ */ new Set();
    }
    function le(s) {
      const e = new URL(window.location.href);
      s.size > 0 ? e.searchParams.set(`${a.window}_expanded_thesis`, Array.from(s).join(",")) : e.searchParams.delete(`${a.window}_expanded_thesis`), window.history.replaceState({}, "", e.toString());
    }
    return (s, e) => (r(), u("div", bt, [
      N(p).isLoading.value ? (r(), u("div", kt, [...e[17] || (e[17] = [
        t("div", { class: "loading-spinner" }, null, -1),
        de(" Loading thesis... ", -1)
      ])])) : N(p).isError.value ? (r(), u("div", $t, [
        e[18] || (e[18] = t("h3", null, "Error loading thesis", -1)),
        t("p", null, m(N(p).error.value), 1)
      ])) : N(p).isSuccess.value ? (r(), u("div", wt, [
        t("div", _t, [
          t("h2", null, [
            t("span", {
              class: Z({ "thesis-header-clickable": a.showHeaderLink }),
              onClick: e[0] || (e[0] = (i) => a.showHeaderLink && $("navigate"))
            }, m(h.value), 3),
            t("button", {
              class: "appname-rename-btn",
              onClick: Q,
              title: "Rename app",
              style: { width: "auto", padding: "2px 7px", "font-size": "13px", background: "none", border: "none", color: "#888", cursor: "pointer" }
            }, "✎")
          ]),
          t("div", Ct, [
            t("button", {
              class: "btn btn-add",
              onClick: ye
            }, [...e[19] || (e[19] = [
              t("span", { class: "icon" }, "➕", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: e[1] || (e[1] = (i) => $("minimize")),
              title: "Close"
            }, " X ")
          ])
        ]),
        t("div", Tt, [
          !N(p).data.value || N(p).data.value.length === 0 ? (r(), u("div", Et, [...e[20] || (e[20] = [
            t("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (r(), u("div", xt, [
            (r(!0), u(R, null, q(Te.value, (i) => (r(), re(yt, {
              key: i.id,
              thesis: i,
              level: 0,
              "thesis-stocks": F.value,
              "expanded-thesis": o.value,
              "editing-cell": D.value,
              "editing-value": I.value,
              onToggle: ce,
              onEdit: ke,
              onDelete: _e,
              onAddStock: he,
              onDeleteStock: ve,
              onStartEditCell: me,
              onSaveEdit: pe,
              onCancelEdit: X,
              onGetCellMetadata: fe,
              onUpdateEditingValue: Ee
            }, null, 8, ["thesis", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128))
          ]))
        ])
      ])) : T("", !0),
      S.value ? (r(), u("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[9] || (e[9] = (i) => S.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[8] || (e[8] = U(() => {
          }, ["stop"]))
        }, [
          t("div", St, [
            t("h3", null, m(v.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            t("button", {
              class: "modal-close",
              onClick: e[2] || (e[2] = (i) => S.value = !1)
            }, "×")
          ]),
          t("div", It, [
            t("div", At, [
              t("label", {
                for: v.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, Dt),
              P(t("input", {
                id: v.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[3] || (e[3] = (i) => J.value = i),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, Ut), [
                [j, J.value]
              ])
            ]),
            t("div", Vt, [
              t("label", {
                for: v.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, Nt),
              P(t("textarea", {
                id: v.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[4] || (e[4] = (i) => te.value = i),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, Bt), [
                [j, te.value]
              ])
            ]),
            t("div", Mt, [
              t("label", {
                for: v.value === "add" ? "thesis-parent" : "edit-thesis-parent"
              }, " Parent Thesis ", 8, Kt),
              P(t("select", {
                id: v.value === "add" ? "thesis-parent" : "edit-thesis-parent",
                "onUpdate:modelValue": e[5] || (e[5] = (i) => se.value = i)
              }, [
                e[21] || (e[21] = t("option", { value: null }, "None (Root Thesis)", -1)),
                (r(!0), u(R, null, q(Ce.value, (i) => (r(), u("option", {
                  key: i.id,
                  value: i.id
                }, m(i.title), 9, Lt))), 128))
              ], 8, Ft), [
                [Ie, se.value]
              ]),
              e[22] || (e[22] = t("small", { class: "form-hint" }, "Select a parent thesis to create a hierarchical structure", -1))
            ])
          ]),
          t("div", Pt, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[6] || (e[6] = (i) => v.value === "edit" ? $e() : S.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: e[7] || (e[7] = (i) => v.value === "add" ? be() : we()),
              disabled: !J.value.trim()
            }, m(v.value === "add" ? "Add Thesis" : "Save Changes"), 9, Rt)
          ])
        ])
      ])) : T("", !0),
      x.value ? (r(), u("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[14] || (e[14] = (i) => x.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[13] || (e[13] = U(() => {
          }, ["stop"]))
        }, [
          t("div", qt, [
            e[23] || (e[23] = t("h3", null, "Add Instrument to Thesis", -1)),
            t("button", {
              class: "modal-close",
              onClick: e[10] || (e[10] = (i) => x.value = !1)
            }, "×")
          ]),
          t("div", zt, [
            t("div", Qt, [
              e[24] || (e[24] = t("label", { for: "stock-symbol" }, "Instrument Symbol *", -1)),
              P(t("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[11] || (e[11] = (i) => C.value = i),
                type: "text",
                placeholder: "Enter instrument symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: b(ee, ["enter"])
              }, null, 544), [
                [j, C.value]
              ])
            ])
          ]),
          t("div", Ht, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[12] || (e[12] = (i) => x.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: ee,
              disabled: !C.value.trim()
            }, " Add Instrument ", 8, Gt)
          ])
        ])
      ])) : T("", !0),
      t("div", Ot, [
        Ae(De, {
          name: "toast",
          tag: "div"
        }, {
          default: Ue(() => [
            (r(!0), u(R, null, q(O.value, (i) => (r(), u("div", {
              key: i.id,
              class: Z(["toast", `toast-${i.type}`]),
              onClick: (c) => W(i.id)
            }, [
              t("div", Xt, [
                i.type === "success" ? (r(), u("span", Jt, "✅")) : i.type === "error" ? (r(), u("span", Wt, "❌")) : i.type === "warning" ? (r(), u("span", Yt, "⚠️")) : i.type === "info" ? (r(), u("span", Zt, "ℹ️")) : T("", !0)
              ]),
              t("div", es, [
                t("div", ts, m(i.title), 1),
                i.message ? (r(), u("div", ss, m(i.message), 1)) : T("", !0)
              ]),
              t("button", {
                class: "toast-close",
                onClick: U((c) => W(i.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, is)
            ], 10, jt))), 128))
          ]),
          _: 1
        })
      ]),
      f.value ? (r(), u("div", ns, [
        t("div", ls, [
          e[25] || (e[25] = t("h3", null, "Rename App", -1)),
          P(t("input", {
            "onUpdate:modelValue": e[15] || (e[15] = (i) => _.value = i),
            placeholder: "App name"
          }, null, 512), [
            [j, _.value]
          ]),
          t("div", as, [
            t("button", { onClick: H }, "Save"),
            t("button", {
              onClick: e[16] || (e[16] = (i) => f.value = !1)
            }, "Cancel")
          ])
        ])
      ])) : T("", !0)
    ]));
  }
}), ds = /* @__PURE__ */ ue(os, [["__scopeId", "data-v-edc538ab"]]), hs = {
  install(l) {
    l.component("Thesis", ds);
  }
};
export {
  ds as Thesis,
  hs as default
};
