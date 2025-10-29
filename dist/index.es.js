import { defineComponent as ne, resolveComponent as we, createElementBlock as u, openBlock as r, normalizeClass as Z, createElementVNode as t, createCommentVNode as w, toDisplayString as m, createTextVNode as le, withModifiers as N, Fragment as R, renderList as q, withKeys as b, createBlock as ae, ref as g, onMounted as Te, watch as Ee, computed as L, unref as B, withDirectives as P, vModelText as j, vModelSelect as xe, createVNode as Se, TransitionGroup as Ie, withCtx as Ae } from "vue";
import { useThesisQuery as De, useSupabase as Ve } from "@y2kfund/core";
import { useQueryClient as Ne } from "@tanstack/vue-query";
const Me = { class: "thesis-item" }, Be = { class: "thesis-expand-icon" }, Ue = { class: "thesis-info" }, Ke = { class: "thesis-title" }, Fe = {
  key: 0,
  class: "thesis-parent-badge"
}, Le = {
  key: 0,
  class: "thesis-description"
}, Pe = { class: "thesis-actions" }, Re = {
  key: 0,
  class: "stocks-section"
}, qe = { class: "stocks-header" }, ze = { class: "stocks-table-wrapper" }, Qe = { class: "stocks-table" }, He = { class: "stock-symbol" }, Ge = ["onDblclick"], Oe = ["value", "onBlur", "onKeyup"], je = { key: 1 }, Je = ["onDblclick"], We = ["value", "onBlur", "onKeyup"], Xe = { key: 1 }, Ye = ["onDblclick"], Ze = ["value", "onBlur", "onKeyup"], et = { key: 1 }, tt = ["onDblclick"], st = ["checked", "onBlur", "onKeyup"], it = { key: 1 }, nt = ["onDblclick"], lt = ["value", "onBlur", "onKeyup"], at = { key: 1 }, dt = ["onDblclick"], ot = ["checked", "onBlur", "onKeyup"], rt = { key: 1 }, ut = ["onDblclick"], ct = ["checked", "onBlur", "onKeyup"], vt = { key: 1 }, ht = { class: "stock-actions" }, mt = ["onClick"], pt = /* @__PURE__ */ ne({
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
    const a = U;
    function $(p) {
      a("update-editing-value", p);
    }
    return (p, n) => {
      var T;
      const K = we("ThesisItem", !0);
      return r(), u("div", {
        class: Z(["thesis-item-wrapper", `thesis-item-level-${l.level}`])
      }, [
        t("div", Me, [
          t("div", {
            class: "thesis-content",
            onClick: n[0] || (n[0] = (d) => a("toggle", l.thesis.id))
          }, [
            t("div", Be, m(l.expandedThesis.has(l.thesis.id) ? "▼" : "▶"), 1),
            t("div", Ue, [
              t("div", Ke, [
                le(m(l.thesis.title) + " ", 1),
                l.thesis.parent_thesis_id ? (r(), u("span", Fe, " ↳ Child ")) : w("", !0)
              ]),
              l.thesis.description ? (r(), u("div", Le, m(l.thesis.description), 1)) : w("", !0)
            ])
          ]),
          t("div", Pe, [
            t("button", {
              class: "btn btn-secondary btn-sm btn-icon",
              onClick: n[1] || (n[1] = N((d) => a("edit", l.thesis), ["stop"])),
              title: "Edit thesis"
            }, " ✏️ "),
            t("button", {
              class: "btn btn-danger btn-sm btn-icon",
              onClick: n[2] || (n[2] = N((d) => a("delete", l.thesis.id, l.thesis.title), ["stop"])),
              title: "Archive thesis"
            }, " 🗑️ ")
          ])
        ]),
        l.expandedThesis.has(l.thesis.id) ? (r(), u("div", Re, [
          t("div", qe, [
            t("h4", null, "Instruments (" + m(((T = l.thesisStocks[l.thesis.id]) == null ? void 0 : T.length) || 0) + ")", 1),
            t("button", {
              class: "btn btn-primary btn-sm btn-icon",
              onClick: n[3] || (n[3] = N((d) => a("add-stock", l.thesis.id), ["stop"])),
              title: "Add Instrument"
            }, " ➕ ")
          ]),
          t("div", ze, [
            t("table", Qe, [
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
                (r(!0), u(R, null, q(l.thesisStocks[l.thesis.id], (d) => {
                  var v, f, E, z, Q, H, G, F, D, I, x, M, _, V;
                  return r(), u("tr", {
                    key: d.id
                  }, [
                    t("td", He, m(d.symbol), 1),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "pe_ratio")
                    }, [
                      ((v = l.editingCell) == null ? void 0 : v.stockId) === d.id && ((f = l.editingCell) == null ? void 0 : f.field) === "pe_ratio" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[4] || (n[4] = (o) => $(o.target.valueAsNumber)),
                        onBlur: (o) => a("save-edit", d, "pe_ratio"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "pe_ratio"), ["enter"]),
                          n[5] || (n[5] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Oe)) : (r(), u("span", je, m(d.pe_ratio ?? "-"), 1))
                    ], 40, Ge),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "peg_ratio")
                    }, [
                      ((E = l.editingCell) == null ? void 0 : E.stockId) === d.id && ((z = l.editingCell) == null ? void 0 : z.field) === "peg_ratio" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: n[6] || (n[6] = (o) => $(o.target.valueAsNumber)),
                        onBlur: (o) => a("save-edit", d, "peg_ratio"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "peg_ratio"), ["enter"]),
                          n[7] || (n[7] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, We)) : (r(), u("span", Xe, m(d.peg_ratio ?? "-"), 1))
                    ], 40, Je),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "analyst_ratings")
                    }, [
                      ((Q = l.editingCell) == null ? void 0 : Q.stockId) === d.id && ((H = l.editingCell) == null ? void 0 : H.field) === "analyst_ratings" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "text",
                        onInput: n[8] || (n[8] = (o) => $(o.target.value)),
                        onBlur: (o) => a("save-edit", d, "analyst_ratings"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "analyst_ratings"), ["enter"]),
                          n[9] || (n[9] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Ze)) : (r(), u("span", et, m(d.analyst_ratings || "-"), 1))
                    ], 40, Ye),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "founder_led")
                    }, [
                      ((G = l.editingCell) == null ? void 0 : G.stockId) === d.id && ((F = l.editingCell) == null ? void 0 : F.field) === "founder_led" ? (r(), u("input", {
                        key: 0,
                        checked: !!l.editingValue,
                        type: "checkbox",
                        onChange: n[10] || (n[10] = (o) => $(o.target.checked)),
                        onBlur: (o) => a("save-edit", d, "founder_led"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "founder_led"), ["enter"]),
                          n[11] || (n[11] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, st)) : (r(), u("span", it, m(d.founder_led ? "✅" : "❌"), 1))
                    ], 40, tt),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "next_earnings_date")
                    }, [
                      ((D = l.editingCell) == null ? void 0 : D.stockId) === d.id && ((I = l.editingCell) == null ? void 0 : I.field) === "next_earnings_date" ? (r(), u("input", {
                        key: 0,
                        value: l.editingValue,
                        type: "date",
                        onInput: n[12] || (n[12] = (o) => $(o.target.value)),
                        onBlur: (o) => a("save-edit", d, "next_earnings_date"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "next_earnings_date"), ["enter"]),
                          n[13] || (n[13] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, lt)) : (r(), u("span", at, m(d.next_earnings_date || "-"), 1))
                    ], 40, nt),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "passed_checks")
                    }, [
                      ((x = l.editingCell) == null ? void 0 : x.stockId) === d.id && ((M = l.editingCell) == null ? void 0 : M.field) === "passed_checks" ? (r(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[14] || (n[14] = (o) => $(o.target.checked)),
                        onBlur: (o) => a("save-edit", d, "passed_checks"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "passed_checks"), ["enter"]),
                          n[15] || (n[15] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, ot)) : (r(), u("span", rt, m(d.passed_checks ? "✅" : "❌"), 1))
                    ], 40, dt),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (o) => a("start-edit-cell", l.thesis.id, d, "currently_held")
                    }, [
                      ((_ = l.editingCell) == null ? void 0 : _.stockId) === d.id && ((V = l.editingCell) == null ? void 0 : V.field) === "currently_held" ? (r(), u("input", {
                        key: 0,
                        checked: l.editingValue,
                        type: "checkbox",
                        onChange: n[16] || (n[16] = (o) => $(o.target.checked)),
                        onBlur: (o) => a("save-edit", d, "currently_held"),
                        onKeyup: [
                          b((o) => a("save-edit", d, "currently_held"), ["enter"]),
                          n[17] || (n[17] = b((o) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, ct)) : (r(), u("span", vt, m(d.currently_held ? "✅" : "❌"), 1))
                    ], 40, ut),
                    t("td", ht, [
                      t("button", {
                        class: "btn btn-danger btn-sm btn-icon",
                        onClick: N((o) => a("delete-stock", l.thesis.id, d.id, d.symbol), ["stop"]),
                        title: "Remove instrument"
                      }, " 🗑️ ", 8, mt)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ])
        ])) : w("", !0),
        l.thesis.children && l.thesis.children.length > 0 ? (r(!0), u(R, { key: 1 }, q(l.thesis.children, (d) => (r(), ae(K, {
          key: d.id,
          thesis: d,
          level: l.level + 1,
          "thesis-stocks": l.thesisStocks,
          "expanded-thesis": l.expandedThesis,
          "editing-cell": l.editingCell,
          "editing-value": l.editingValue,
          onToggle: n[18] || (n[18] = (v) => a("toggle", v)),
          onEdit: n[19] || (n[19] = (v) => a("edit", v)),
          onDelete: n[20] || (n[20] = (v, f) => a("delete", v, f)),
          onAddStock: n[21] || (n[21] = (v) => a("add-stock", v)),
          onDeleteStock: n[22] || (n[22] = (v, f, E) => a("delete-stock", v, f, E)),
          onStartEditCell: n[23] || (n[23] = (v, f, E) => a("start-edit-cell", v, f, E)),
          onSaveEdit: n[24] || (n[24] = (v, f) => a("save-edit", v, f)),
          onCancelEdit: n[25] || (n[25] = () => a("cancel-edit")),
          onGetCellMetadata: n[26] || (n[26] = (v, f) => a("get-cell-metadata", v, f)),
          onUpdateEditingValue: n[27] || (n[27] = (v) => a("update-editing-value", v))
        }, null, 8, ["thesis", "level", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128)) : w("", !0)
      ], 2);
    };
  }
}), de = (l, U) => {
  const a = l.__vccOpts || l;
  for (const [$, p] of U)
    a[$] = p;
  return a;
}, ft = /* @__PURE__ */ de(pt, [["__scopeId", "data-v-99d2dbe1"]]), gt = { class: "thesis-card" }, yt = {
  key: 0,
  class: "loading"
}, bt = {
  key: 1,
  class: "error"
}, kt = {
  key: 2,
  class: "thesis-container"
}, $t = { class: "thesis-header" }, Ct = { class: "thesis-header-actions" }, _t = { class: "thesis-list" }, wt = {
  key: 0,
  class: "thesis-empty"
}, Tt = {
  key: 1,
  class: "thesis-items"
}, Et = { class: "modal-header" }, xt = { class: "modal-body" }, St = { class: "form-group" }, It = ["for"], At = ["id"], Dt = { class: "form-group" }, Vt = ["for"], Nt = ["id"], Mt = { class: "form-group" }, Bt = ["for"], Ut = ["id"], Kt = ["value"], Ft = { class: "modal-footer" }, Lt = ["disabled"], Pt = { class: "modal-header" }, Rt = { class: "modal-body" }, qt = { class: "form-group" }, zt = { class: "modal-footer" }, Qt = ["disabled"], Ht = { class: "toast-container" }, Gt = ["onClick"], Ot = { class: "toast-icon" }, jt = { key: 0 }, Jt = { key: 1 }, Wt = { key: 2 }, Xt = { key: 3 }, Yt = { class: "toast-content" }, Zt = { class: "toast-title" }, es = {
  key: 0,
  class: "toast-message"
}, ts = ["onClick"], ss = {
  key: 5,
  class: "rename-dialog-backdrop"
}, is = { class: "rename-dialog" }, ns = { class: "dialog-actions" }, ls = /* @__PURE__ */ ne({
  __name: "Thesis",
  props: {
    userId: { default: null },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(l, { emit: U }) {
    const a = l, $ = U, p = De(), n = Ve(), K = Ne(), T = g(""), d = g("Thesis Management"), v = g(!1), f = g("");
    function E() {
      return new URL(window.location.href).searchParams.get("thesis_app_name") || "Thesis Management";
    }
    function z(s) {
      const e = new URL(window.location.href);
      s && s.trim() && s !== "Thesis Management" ? e.searchParams.set("thesis_app_name", s.trim()) : e.searchParams.delete("thesis_app_name"), window.history.replaceState({}, "", e.toString());
    }
    function Q() {
      f.value = d.value, v.value = !0;
    }
    function H() {
      d.value = f.value.trim() || "Thesis Management", z(d.value), v.value = !1;
    }
    Te(() => {
      d.value = E(), window.addEventListener("popstate", () => {
        d.value = E();
      });
    });
    async function G() {
      var s;
      try {
        const { data: { user: e } } = await n.auth.getUser();
        e != null && e.email ? T.value = e.email : (s = e == null ? void 0 : e.user_metadata) != null && s.name ? T.value = e.user_metadata.name : a.userId && (T.value = a.userId);
      } catch (e) {
        console.error("Error fetching current user:", e), a.userId && (T.value = a.userId);
      }
    }
    G();
    const F = g({}), D = g(null), I = g(null), x = g(!1), M = g(""), _ = g(""), V = g(/* @__PURE__ */ new Set());
    async function o() {
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
    Ee(() => p.data.value, (s) => {
      s && s.length > 0 && o();
    }, { immediate: !0 });
    function oe(s) {
      V.value.has(s) ? V.value.delete(s) : V.value.add(s);
    }
    function re(s) {
      M.value = s, _.value = "", x.value = !0;
    }
    async function ee() {
      if (!(!_.value.trim() || !M.value))
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisStocks").insert([{
            thesis_id: M.value,
            symbol: _.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1,
            analyst_ratings: "",
            founder_led: !1,
            next_earnings_date: null
          }]).select();
          if (e) throw e;
          await o(), _.value = "", x.value = !1, k("success", "Instrument Added", `${_.value} has been added to the thesis`);
        } catch (s) {
          console.error("Error adding stock:", s), k("error", "Error", `Failed to add instrument: ${s.message}`);
        }
    }
    async function ue(s, e, i) {
      if (confirm(`Are you sure you want to remove ${i} from this thesis?`))
        try {
          const { error: c } = await n.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (c) throw c;
          await o(), k("success", "Instrument Removed", `${i} has been removed from the thesis`);
        } catch (c) {
          console.error("Error deleting stock:", c), k("error", "Error", `Failed to remove stock: ${c.message}`);
        }
    }
    function ce(s, e, i) {
      D.value = { thesisId: s, stockId: e.id, field: i }, I.value = e[i];
    }
    function J() {
      D.value = null, I.value = null;
    }
    async function ve(s, e) {
      if (D.value) {
        if (!T.value) {
          k("error", "Error", "User information not available"), J();
          return;
        }
        try {
          const i = {
            [e]: I.value,
            [`${e}_updated_by`]: T.value,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: c } = await n.schema("hf").from("thesisStocks").update(i).eq("id", s.id);
          if (c) throw c;
          await o(), J(), k("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (i) {
          console.error("Error updating stock:", i), k("error", "Error", `Failed to update: ${i.message}`);
        }
      }
    }
    function he(s, e) {
      const i = s[`${e}_updated_by`], c = s[`${e}_updated_at`];
      if (i && c) {
        const A = new Date(c).toLocaleString();
        return `Updated by: ${i}
Updated at: ${A}`;
      }
      return "No updates yet";
    }
    const S = g(!1), h = g("add"), C = g({ title: "", description: "", parent_thesis_id: null }), y = g({ id: "", title: "", description: "", parent_thesis_id: null }), W = L({
      get: () => h.value === "add" ? C.value.title : y.value.title,
      set: (s) => {
        h.value === "add" ? C.value.title = s : y.value.title = s;
      }
    }), te = L({
      get: () => h.value === "add" ? C.value.description : y.value.description,
      set: (s) => {
        h.value === "add" ? C.value.description = s : y.value.description = s;
      }
    }), se = L({
      get: () => h.value === "add" ? C.value.parent_thesis_id : y.value.parent_thesis_id,
      set: (s) => {
        h.value === "add" ? C.value.parent_thesis_id = s : y.value.parent_thesis_id = s;
      }
    }), O = g([]);
    let me = 0;
    function k(s, e, i) {
      const c = me++;
      O.value.push({ id: c, type: s, title: e, message: i }), setTimeout(() => {
        X(c);
      }, 5e3);
    }
    function X(s) {
      const e = O.value.findIndex((i) => i.id === s);
      e !== -1 && O.value.splice(e, 1);
    }
    function pe() {
      h.value = "add", C.value = { title: "", description: "", parent_thesis_id: null }, S.value = !0;
    }
    async function fe() {
      if (C.value.title.trim())
        try {
          const { data: s, error: e } = await n.schema("hf").from("thesisMaster").insert([{
            title: C.value.title.trim(),
            description: C.value.description.trim() || null,
            parent_thesis_id: C.value.parent_thesis_id || null
          }]).select();
          if (e) throw e;
          K.invalidateQueries({ queryKey: ["thesis"] }), C.value = { title: "", description: "", parent_thesis_id: null }, S.value = !1, k("success", "Thesis Added", "New thesis has been created successfully");
        } catch (s) {
          console.error("Error adding thesis:", s), k("error", "Error", `Failed to add thesis: ${s.message}`);
        }
    }
    function ge(s) {
      y.value = {
        id: s.id,
        title: s.title,
        description: s.description || "",
        parent_thesis_id: s.parent_thesis_id || null
      }, h.value = "edit", S.value = !0;
    }
    function ye() {
      y.value = { id: "", title: "", description: "", parent_thesis_id: null }, S.value = !1;
    }
    async function be() {
      if (y.value.title.trim())
        try {
          const { error: s } = await n.schema("hf").from("thesisMaster").update({
            title: y.value.title.trim(),
            description: y.value.description.trim() || null,
            parent_thesis_id: y.value.parent_thesis_id || null
          }).eq("id", y.value.id);
          if (s) throw s;
          K.invalidateQueries({ queryKey: ["thesis"] }), y.value = { id: "", title: "", description: "", parent_thesis_id: null }, S.value = !1, k("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (s) {
          console.error("Error updating thesis:", s), k("error", "Error", `Failed to update thesis: ${s.message}`);
        }
    }
    async function ke(s, e) {
      if (confirm(`Are you sure you want to archive thesis "${e}"?

Note: This will also archive all instruments associated with this thesis.`))
        try {
          await n.schema("hf").from("thesisStocks").delete().eq("thesis_id", s);
          const { error: i } = await n.schema("hf").from("thesisMaster").delete().eq("id", s);
          if (i) throw i;
          K.invalidateQueries({ queryKey: ["thesis"] }), await o(), k("success", "Thesis Deleted", "Thesis and associated instruments have been deleted successfully");
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
    const $e = L(() => {
      if (!p.data.value) return [];
      const s = h.value === "edit" ? y.value.id : null;
      return p.data.value.filter((e) => !(s && !ie(e.id, s)));
    }), Ce = L(() => {
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
    function _e(s) {
      I.value = s;
    }
    return (s, e) => (r(), u("div", gt, [
      B(p).isLoading.value ? (r(), u("div", yt, [...e[17] || (e[17] = [
        t("div", { class: "loading-spinner" }, null, -1),
        le(" Loading thesis... ", -1)
      ])])) : B(p).isError.value ? (r(), u("div", bt, [
        e[18] || (e[18] = t("h3", null, "Error loading thesis", -1)),
        t("p", null, m(B(p).error.value), 1)
      ])) : B(p).isSuccess.value ? (r(), u("div", kt, [
        t("div", $t, [
          t("h2", null, [
            t("span", {
              class: Z({ "thesis-header-clickable": a.showHeaderLink }),
              onClick: e[0] || (e[0] = (i) => a.showHeaderLink && $("navigate"))
            }, m(d.value), 3),
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
              onClick: pe
            }, [...e[19] || (e[19] = [
              t("span", { class: "icon" }, "➕", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: e[1] || (e[1] = (i) => $("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        t("div", _t, [
          !B(p).data.value || B(p).data.value.length === 0 ? (r(), u("div", wt, [...e[20] || (e[20] = [
            t("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (r(), u("div", Tt, [
            (r(!0), u(R, null, q(Ce.value, (i) => (r(), ae(ft, {
              key: i.id,
              thesis: i,
              level: 0,
              "thesis-stocks": F.value,
              "expanded-thesis": V.value,
              "editing-cell": D.value,
              "editing-value": I.value,
              onToggle: oe,
              onEdit: ge,
              onDelete: ke,
              onAddStock: re,
              onDeleteStock: ue,
              onStartEditCell: ce,
              onSaveEdit: ve,
              onCancelEdit: J,
              onGetCellMetadata: he,
              onUpdateEditingValue: _e
            }, null, 8, ["thesis", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128))
          ]))
        ])
      ])) : w("", !0),
      S.value ? (r(), u("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[9] || (e[9] = (i) => S.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[8] || (e[8] = N(() => {
          }, ["stop"]))
        }, [
          t("div", Et, [
            t("h3", null, m(h.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            t("button", {
              class: "modal-close",
              onClick: e[2] || (e[2] = (i) => S.value = !1)
            }, "×")
          ]),
          t("div", xt, [
            t("div", St, [
              t("label", {
                for: h.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, It),
              P(t("input", {
                id: h.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[3] || (e[3] = (i) => W.value = i),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, At), [
                [j, W.value]
              ])
            ]),
            t("div", Dt, [
              t("label", {
                for: h.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, Vt),
              P(t("textarea", {
                id: h.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[4] || (e[4] = (i) => te.value = i),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, Nt), [
                [j, te.value]
              ])
            ]),
            t("div", Mt, [
              t("label", {
                for: h.value === "add" ? "thesis-parent" : "edit-thesis-parent"
              }, " Parent Thesis ", 8, Bt),
              P(t("select", {
                id: h.value === "add" ? "thesis-parent" : "edit-thesis-parent",
                "onUpdate:modelValue": e[5] || (e[5] = (i) => se.value = i)
              }, [
                e[21] || (e[21] = t("option", { value: null }, "None (Root Thesis)", -1)),
                (r(!0), u(R, null, q($e.value, (i) => (r(), u("option", {
                  key: i.id,
                  value: i.id
                }, m(i.title), 9, Kt))), 128))
              ], 8, Ut), [
                [xe, se.value]
              ]),
              e[22] || (e[22] = t("small", { class: "form-hint" }, "Select a parent thesis to create a hierarchical structure", -1))
            ])
          ]),
          t("div", Ft, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[6] || (e[6] = (i) => h.value === "edit" ? ye() : S.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: e[7] || (e[7] = (i) => h.value === "add" ? fe() : be()),
              disabled: !W.value.trim()
            }, m(h.value === "add" ? "Add Thesis" : "Save Changes"), 9, Lt)
          ])
        ])
      ])) : w("", !0),
      x.value ? (r(), u("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[14] || (e[14] = (i) => x.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[13] || (e[13] = N(() => {
          }, ["stop"]))
        }, [
          t("div", Pt, [
            e[23] || (e[23] = t("h3", null, "Add Instrument to Thesis", -1)),
            t("button", {
              class: "modal-close",
              onClick: e[10] || (e[10] = (i) => x.value = !1)
            }, "×")
          ]),
          t("div", Rt, [
            t("div", qt, [
              e[24] || (e[24] = t("label", { for: "stock-symbol" }, "Instrument Symbol *", -1)),
              P(t("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[11] || (e[11] = (i) => _.value = i),
                type: "text",
                placeholder: "Enter instrument symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: b(ee, ["enter"])
              }, null, 544), [
                [j, _.value]
              ])
            ])
          ]),
          t("div", zt, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[12] || (e[12] = (i) => x.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: ee,
              disabled: !_.value.trim()
            }, " Add Instrument ", 8, Qt)
          ])
        ])
      ])) : w("", !0),
      t("div", Ht, [
        Se(Ie, {
          name: "toast",
          tag: "div"
        }, {
          default: Ae(() => [
            (r(!0), u(R, null, q(O.value, (i) => (r(), u("div", {
              key: i.id,
              class: Z(["toast", `toast-${i.type}`]),
              onClick: (c) => X(i.id)
            }, [
              t("div", Ot, [
                i.type === "success" ? (r(), u("span", jt, "✅")) : i.type === "error" ? (r(), u("span", Jt, "❌")) : i.type === "warning" ? (r(), u("span", Wt, "⚠️")) : i.type === "info" ? (r(), u("span", Xt, "ℹ️")) : w("", !0)
              ]),
              t("div", Yt, [
                t("div", Zt, m(i.title), 1),
                i.message ? (r(), u("div", es, m(i.message), 1)) : w("", !0)
              ]),
              t("button", {
                class: "toast-close",
                onClick: N((c) => X(i.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, ts)
            ], 10, Gt))), 128))
          ]),
          _: 1
        })
      ]),
      v.value ? (r(), u("div", ss, [
        t("div", is, [
          e[25] || (e[25] = t("h3", null, "Rename App", -1)),
          P(t("input", {
            "onUpdate:modelValue": e[15] || (e[15] = (i) => f.value = i),
            placeholder: "App name"
          }, null, 512), [
            [j, f.value]
          ]),
          t("div", ns, [
            t("button", { onClick: H }, "Save"),
            t("button", {
              onClick: e[16] || (e[16] = (i) => v.value = !1)
            }, "Cancel")
          ])
        ])
      ])) : w("", !0)
    ]));
  }
}), as = /* @__PURE__ */ de(ls, [["__scopeId", "data-v-3e67b5bd"]]), us = {
  install(l) {
    l.component("Thesis", as);
  }
};
export {
  as as Thesis,
  us as default
};
