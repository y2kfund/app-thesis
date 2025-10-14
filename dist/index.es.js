import { defineComponent as ee, resolveComponent as pe, createElementBlock as o, openBlock as d, normalizeClass as j, createElementVNode as t, createCommentVNode as T, toDisplayString as y, createTextVNode as J, withModifiers as D, Fragment as K, renderList as F, withKeys as S, createBlock as te, ref as b, watch as ge, computed as B, unref as M, withDirectives as Q, vModelText as O, vModelSelect as ke, createVNode as be, TransitionGroup as $e, withCtx as Ce } from "vue";
import { useThesisQuery as Te, useSupabase as _e } from "@y2kfund/core";
import { useQueryClient as we } from "@tanstack/vue-query";
const Ee = { class: "thesis-item" }, Se = { class: "thesis-expand-icon" }, xe = { class: "thesis-info" }, Ie = { class: "thesis-title" }, Ae = {
  key: 0,
  class: "thesis-parent-badge"
}, De = {
  key: 0,
  class: "thesis-description"
}, Ve = { class: "thesis-meta" }, Me = {
  key: 0,
  class: "thesis-date"
}, Ne = { class: "thesis-stock-count" }, Ue = {
  key: 1,
  class: "thesis-children-count"
}, Be = { class: "thesis-actions" }, Ke = {
  key: 0,
  class: "stocks-section"
}, Fe = { class: "stocks-header" }, qe = {
  key: 0,
  class: "stocks-empty"
}, Le = {
  key: 1,
  class: "stocks-table-wrapper"
}, Pe = { class: "stocks-table" }, Qe = { class: "stock-symbol" }, ze = ["onDblclick"], He = ["value", "onBlur", "onKeyup"], Re = { key: 1 }, Ge = ["onDblclick"], Oe = ["value", "onBlur", "onKeyup"], je = { key: 1 }, Je = ["onDblclick"], We = ["checked", "onBlur", "onKeyup"], Xe = { key: 1 }, Ye = ["onDblclick"], Ze = ["checked", "onBlur", "onKeyup"], et = { key: 1 }, tt = { class: "stock-actions" }, st = ["onClick"], it = /* @__PURE__ */ ee({
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
  setup(n, { emit: N }) {
    const a = N;
    function _(m) {
      a("update-editing-value", m);
    }
    return (m, l) => {
      var w, q;
      const U = pe("ThesisItem", !0);
      return d(), o("div", {
        class: j(["thesis-item-wrapper", `thesis-item-level-${n.level}`])
      }, [
        t("div", Ee, [
          t("div", {
            class: "thesis-content",
            onClick: l[0] || (l[0] = (r) => a("toggle", n.thesis.id))
          }, [
            t("div", Se, y(n.expandedThesis.has(n.thesis.id) ? "▼" : "▶"), 1),
            t("div", xe, [
              t("div", Ie, [
                J(y(n.thesis.title) + " ", 1),
                n.thesis.parent_thesis_id ? (d(), o("span", Ae, " ↳ Child ")) : T("", !0)
              ]),
              n.thesis.description ? (d(), o("div", De, y(n.thesis.description), 1)) : T("", !0),
              t("div", Ve, [
                n.thesis.created_at ? (d(), o("span", Me, " Created: " + y(new Date(n.thesis.created_at).toLocaleDateString()), 1)) : T("", !0),
                t("span", Ne, y(((w = n.thesisStocks[n.thesis.id]) == null ? void 0 : w.length) || 0) + " instruments ", 1),
                ((q = n.thesis.children) == null ? void 0 : q.length) > 0 ? (d(), o("span", Ue, y(n.thesis.children.length) + " child thesis ", 1)) : T("", !0)
              ])
            ])
          ]),
          t("div", Be, [
            t("button", {
              class: "btn btn-secondary btn-sm",
              onClick: l[1] || (l[1] = D((r) => a("edit", n.thesis), ["stop"])),
              title: "Edit thesis"
            }, " ✏️ Edit "),
            t("button", {
              class: "btn btn-danger btn-sm",
              onClick: l[2] || (l[2] = D((r) => a("delete", n.thesis.id, n.thesis.title), ["stop"])),
              title: "Archive thesis"
            }, " 🗑️ ")
          ])
        ]),
        n.expandedThesis.has(n.thesis.id) ? (d(), o("div", Ke, [
          t("div", Fe, [
            l[22] || (l[22] = t("h4", null, "Instruments", -1)),
            t("button", {
              class: "btn btn-primary btn-sm",
              onClick: l[3] || (l[3] = D((r) => a("add-stock", n.thesis.id), ["stop"]))
            }, " ➕ Add Instrument ")
          ]),
          !n.thesisStocks[n.thesis.id] || n.thesisStocks[n.thesis.id].length === 0 ? (d(), o("div", qe, ' No instruments added yet. Click "Add Instrument" to add one. ')) : (d(), o("div", Le, [
            t("table", Pe, [
              l[23] || (l[23] = t("thead", null, [
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
                (d(!0), o(K, null, F(n.thesisStocks[n.thesis.id], (r) => {
                  var h, f, k, V, C, A, x, L;
                  return d(), o("tr", {
                    key: r.id
                  }, [
                    t("td", Qe, y(r.symbol), 1),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (c) => a("start-edit-cell", n.thesis.id, r, "pe_ratio")
                    }, [
                      ((h = n.editingCell) == null ? void 0 : h.stockId) === r.id && ((f = n.editingCell) == null ? void 0 : f.field) === "pe_ratio" ? (d(), o("input", {
                        key: 0,
                        value: n.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: l[4] || (l[4] = (c) => _(c.target.valueAsNumber)),
                        onBlur: (c) => a("save-edit", r, "pe_ratio"),
                        onKeyup: [
                          S((c) => a("save-edit", r, "pe_ratio"), ["enter"]),
                          l[5] || (l[5] = S((c) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, He)) : (d(), o("span", Re, y(r.pe_ratio ?? "-"), 1))
                    ], 40, ze),
                    t("td", {
                      class: "editable-cell",
                      onDblclick: (c) => a("start-edit-cell", n.thesis.id, r, "peg_ratio")
                    }, [
                      ((k = n.editingCell) == null ? void 0 : k.stockId) === r.id && ((V = n.editingCell) == null ? void 0 : V.field) === "peg_ratio" ? (d(), o("input", {
                        key: 0,
                        value: n.editingValue,
                        type: "number",
                        step: "0.01",
                        onInput: l[6] || (l[6] = (c) => _(c.target.valueAsNumber)),
                        onBlur: (c) => a("save-edit", r, "peg_ratio"),
                        onKeyup: [
                          S((c) => a("save-edit", r, "peg_ratio"), ["enter"]),
                          l[7] || (l[7] = S((c) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Oe)) : (d(), o("span", je, y(r.peg_ratio ?? "-"), 1))
                    ], 40, Ge),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (c) => a("start-edit-cell", n.thesis.id, r, "passed_checks")
                    }, [
                      ((C = n.editingCell) == null ? void 0 : C.stockId) === r.id && ((A = n.editingCell) == null ? void 0 : A.field) === "passed_checks" ? (d(), o("input", {
                        key: 0,
                        checked: n.editingValue,
                        type: "checkbox",
                        onChange: l[8] || (l[8] = (c) => _(c.target.checked)),
                        onBlur: (c) => a("save-edit", r, "passed_checks"),
                        onKeyup: [
                          S((c) => a("save-edit", r, "passed_checks"), ["enter"]),
                          l[9] || (l[9] = S((c) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, We)) : (d(), o("span", Xe, y(r.passed_checks ? "✅" : "❌"), 1))
                    ], 40, Je),
                    t("td", {
                      class: "editable-cell checkbox-cell",
                      onDblclick: (c) => a("start-edit-cell", n.thesis.id, r, "currently_held")
                    }, [
                      ((x = n.editingCell) == null ? void 0 : x.stockId) === r.id && ((L = n.editingCell) == null ? void 0 : L.field) === "currently_held" ? (d(), o("input", {
                        key: 0,
                        checked: n.editingValue,
                        type: "checkbox",
                        onChange: l[10] || (l[10] = (c) => _(c.target.checked)),
                        onBlur: (c) => a("save-edit", r, "currently_held"),
                        onKeyup: [
                          S((c) => a("save-edit", r, "currently_held"), ["enter"]),
                          l[11] || (l[11] = S((c) => a("cancel-edit"), ["escape"]))
                        ],
                        autofocus: ""
                      }, null, 40, Ze)) : (d(), o("span", et, y(r.currently_held ? "✅" : "❌"), 1))
                    ], 40, Ye),
                    t("td", tt, [
                      t("button", {
                        class: "btn btn-danger btn-sm",
                        onClick: D((c) => a("delete-stock", n.thesis.id, r.id, r.symbol), ["stop"]),
                        title: "Remove instrument"
                      }, " 🗑️ ", 8, st)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ]))
        ])) : T("", !0),
        n.thesis.children && n.thesis.children.length > 0 ? (d(!0), o(K, { key: 1 }, F(n.thesis.children, (r) => (d(), te(U, {
          key: r.id,
          thesis: r,
          level: n.level + 1,
          "thesis-stocks": n.thesisStocks,
          "expanded-thesis": n.expandedThesis,
          "editing-cell": n.editingCell,
          "editing-value": n.editingValue,
          onToggle: l[12] || (l[12] = (h) => a("toggle", h)),
          onEdit: l[13] || (l[13] = (h) => a("edit", h)),
          onDelete: l[14] || (l[14] = (h, f) => a("delete", h, f)),
          onAddStock: l[15] || (l[15] = (h) => a("add-stock", h)),
          onDeleteStock: l[16] || (l[16] = (h, f, k) => a("delete-stock", h, f, k)),
          onStartEditCell: l[17] || (l[17] = (h, f, k) => a("start-edit-cell", h, f, k)),
          onSaveEdit: l[18] || (l[18] = (h, f) => a("save-edit", h, f)),
          onCancelEdit: l[19] || (l[19] = () => a("cancel-edit")),
          onGetCellMetadata: l[20] || (l[20] = (h, f) => a("get-cell-metadata", h, f)),
          onUpdateEditingValue: l[21] || (l[21] = (h) => a("update-editing-value", h))
        }, null, 8, ["thesis", "level", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128)) : T("", !0)
      ], 2);
    };
  }
}), se = (n, N) => {
  const a = n.__vccOpts || n;
  for (const [_, m] of N)
    a[_] = m;
  return a;
}, nt = /* @__PURE__ */ se(it, [["__scopeId", "data-v-cfc365bc"]]), lt = { class: "thesis-card" }, at = {
  key: 0,
  class: "loading"
}, dt = {
  key: 1,
  class: "error"
}, ot = {
  key: 2,
  class: "thesis-container"
}, rt = { class: "thesis-header" }, ut = { class: "thesis-header-actions" }, ct = { class: "thesis-list" }, ht = {
  key: 0,
  class: "thesis-empty"
}, vt = {
  key: 1,
  class: "thesis-items"
}, mt = { class: "modal-header" }, ft = { class: "modal-body" }, yt = { class: "form-group" }, pt = ["for"], gt = ["id"], kt = { class: "form-group" }, bt = ["for"], $t = ["id"], Ct = { class: "form-group" }, Tt = ["for"], _t = ["id"], wt = ["value"], Et = { class: "modal-footer" }, St = ["disabled"], xt = { class: "modal-header" }, It = { class: "modal-body" }, At = { class: "form-group" }, Dt = { class: "modal-footer" }, Vt = ["disabled"], Mt = { class: "toast-container" }, Nt = ["onClick"], Ut = { class: "toast-icon" }, Bt = { key: 0 }, Kt = { key: 1 }, Ft = { key: 2 }, qt = { key: 3 }, Lt = { class: "toast-content" }, Pt = { class: "toast-title" }, Qt = {
  key: 0,
  class: "toast-message"
}, zt = ["onClick"], Ht = /* @__PURE__ */ ee({
  __name: "Thesis",
  props: {
    userId: { default: null },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(n, { emit: N }) {
    const a = n, _ = N, m = Te(), l = _e(), U = we(), w = b("");
    async function q() {
      var s;
      try {
        const { data: { user: e } } = await l.auth.getUser();
        e != null && e.email ? w.value = e.email : (s = e == null ? void 0 : e.user_metadata) != null && s.name ? w.value = e.user_metadata.name : a.userId && (w.value = a.userId);
      } catch (e) {
        console.error("Error fetching current user:", e), a.userId && (w.value = a.userId);
      }
    }
    q();
    const r = b({}), h = b(null), f = b(null), k = b(!1), V = b(""), C = b(""), A = b(/* @__PURE__ */ new Set());
    async function x() {
      try {
        const { data: s, error: e } = await l.schema("hf").from("thesisStocks").select("*").order("symbol");
        if (e) throw e;
        const i = {};
        s == null || s.forEach((u) => {
          i[u.thesis_id] || (i[u.thesis_id] = []), i[u.thesis_id].push(u);
        }), r.value = i;
      } catch (s) {
        console.error("Error loading thesis stocks:", s), g("error", "Error", `Failed to load instruments: ${s.message}`);
      }
    }
    ge(() => m.data.value, (s) => {
      s && s.length > 0 && x();
    }, { immediate: !0 });
    function L(s) {
      A.value.has(s) ? A.value.delete(s) : A.value.add(s);
    }
    function c(s) {
      V.value = s, C.value = "", k.value = !0;
    }
    async function W() {
      if (!(!C.value.trim() || !V.value))
        try {
          const { data: s, error: e } = await l.schema("hf").from("thesisStocks").insert([{
            thesis_id: V.value,
            symbol: C.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1
          }]).select();
          if (e) throw e;
          await x(), C.value = "", k.value = !1, g("success", "Instrument Added", `${C.value} has been added to the thesis`);
        } catch (s) {
          console.error("Error adding stock:", s), g("error", "Error", `Failed to add instrument: ${s.message}`);
        }
    }
    async function ie(s, e, i) {
      if (confirm(`Are you sure you want to remove ${i} from this thesis?`))
        try {
          const { error: u } = await l.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (u) throw u;
          await x(), g("success", "Instrument Removed", `${i} has been removed from the thesis`);
        } catch (u) {
          console.error("Error deleting stock:", u), g("error", "Error", `Failed to remove stock: ${u.message}`);
        }
    }
    function ne(s, e, i) {
      h.value = { thesisId: s, stockId: e.id, field: i }, f.value = e[i];
    }
    function z() {
      h.value = null, f.value = null;
    }
    async function le(s, e) {
      if (h.value) {
        if (!w.value) {
          g("error", "Error", "User information not available"), z();
          return;
        }
        try {
          const i = {
            [e]: f.value,
            [`${e}_updated_by`]: w.value,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: u } = await l.schema("hf").from("thesisStocks").update(i).eq("id", s.id);
          if (u) throw u;
          await x(), z(), g("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (i) {
          console.error("Error updating stock:", i), g("error", "Error", `Failed to update: ${i.message}`);
        }
      }
    }
    function ae(s, e) {
      const i = s[`${e}_updated_by`], u = s[`${e}_updated_at`];
      if (i && u) {
        const I = new Date(u).toLocaleString();
        return `Updated by: ${i}
Updated at: ${I}`;
      }
      return "No updates yet";
    }
    const E = b(!1), v = b("add"), $ = b({ title: "", description: "", parent_thesis_id: null }), p = b({ id: "", title: "", description: "", parent_thesis_id: null }), H = B({
      get: () => v.value === "add" ? $.value.title : p.value.title,
      set: (s) => {
        v.value === "add" ? $.value.title = s : p.value.title = s;
      }
    }), X = B({
      get: () => v.value === "add" ? $.value.description : p.value.description,
      set: (s) => {
        v.value === "add" ? $.value.description = s : p.value.description = s;
      }
    }), Y = B({
      get: () => v.value === "add" ? $.value.parent_thesis_id : p.value.parent_thesis_id,
      set: (s) => {
        v.value === "add" ? $.value.parent_thesis_id = s : p.value.parent_thesis_id = s;
      }
    }), P = b([]);
    let de = 0;
    function g(s, e, i) {
      const u = de++;
      P.value.push({ id: u, type: s, title: e, message: i }), setTimeout(() => {
        R(u);
      }, 5e3);
    }
    function R(s) {
      const e = P.value.findIndex((i) => i.id === s);
      e !== -1 && P.value.splice(e, 1);
    }
    function oe() {
      v.value = "add", $.value = { title: "", description: "", parent_thesis_id: null }, E.value = !0;
    }
    async function re() {
      if ($.value.title.trim())
        try {
          const { data: s, error: e } = await l.schema("hf").from("thesisMaster").insert([{
            title: $.value.title.trim(),
            description: $.value.description.trim() || null,
            parent_thesis_id: $.value.parent_thesis_id || null
          }]).select();
          if (e) throw e;
          U.invalidateQueries({ queryKey: ["thesis"] }), $.value = { title: "", description: "", parent_thesis_id: null }, E.value = !1, g("success", "Thesis Added", "New thesis has been created successfully");
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
          const { error: s } = await l.schema("hf").from("thesisMaster").update({
            title: p.value.title.trim(),
            description: p.value.description.trim() || null,
            parent_thesis_id: p.value.parent_thesis_id || null
          }).eq("id", p.value.id);
          if (s) throw s;
          U.invalidateQueries({ queryKey: ["thesis"] }), p.value = { id: "", title: "", description: "", parent_thesis_id: null }, E.value = !1, g("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (s) {
          console.error("Error updating thesis:", s), g("error", "Error", `Failed to update thesis: ${s.message}`);
        }
    }
    async function ve(s, e) {
      if (confirm(`Are you sure you want to archive thesis "${e}"?

Note: This will also archive all instruments associated with this thesis.`))
        try {
          await l.schema("hf").from("thesisStocks").delete().eq("thesis_id", s);
          const { error: i } = await l.schema("hf").from("thesisMaster").delete().eq("id", s);
          if (i) throw i;
          U.invalidateQueries({ queryKey: ["thesis"] }), await x(), g("success", "Thesis Deleted", "Thesis and associated instruments have been deleted successfully");
        } catch (i) {
          console.error("Error deleting thesis:", i), g("error", "Error", `Failed to archive thesis: ${i.message}`);
        }
    }
    function Z(s, e) {
      var u;
      if (s === e) return !1;
      const i = (u = m.data.value) == null ? void 0 : u.find((I) => I.id === s);
      return i ? i.parent_thesis_id === e ? !1 : i.parent_thesis_id ? Z(i.parent_thesis_id, e) : !0 : !0;
    }
    const me = B(() => {
      if (!m.data.value) return [];
      const s = v.value === "edit" ? p.value.id : null;
      return m.data.value.filter((e) => !(s && !Z(e.id, s)));
    }), fe = B(() => {
      if (!m.data.value) return [];
      const s = m.data.value.filter((u) => !u.parent_thesis_id);
      function e(u) {
        var I;
        return ((I = m.data.value) == null ? void 0 : I.filter((G) => G.parent_thesis_id === u)) || [];
      }
      function i(u) {
        const I = e(u.id);
        return {
          ...u,
          children: I.map((G) => i(G))
        };
      }
      return s.map((u) => i(u));
    });
    function ye(s) {
      f.value = s;
    }
    return (s, e) => (d(), o("div", lt, [
      M(m).isLoading.value ? (d(), o("div", at, [...e[15] || (e[15] = [
        t("div", { class: "loading-spinner" }, null, -1),
        J(" Loading thesis... ", -1)
      ])])) : M(m).isError.value ? (d(), o("div", dt, [
        e[16] || (e[16] = t("h3", null, "Error loading thesis", -1)),
        t("p", null, y(M(m).error.value), 1)
      ])) : M(m).isSuccess.value ? (d(), o("div", ot, [
        t("div", rt, [
          t("h2", {
            class: j({ "thesis-header-clickable": a.showHeaderLink }),
            onClick: e[0] || (e[0] = (i) => a.showHeaderLink && _("navigate"))
          }, " Thesis Management ", 2),
          t("div", ut, [
            t("button", {
              class: "btn btn-primary",
              onClick: oe
            }, [...e[17] || (e[17] = [
              t("span", { class: "icon" }, "➕", -1),
              J(" Add New Thesis ", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: e[1] || (e[1] = (i) => _("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        t("div", ct, [
          !M(m).data.value || M(m).data.value.length === 0 ? (d(), o("div", ht, [...e[18] || (e[18] = [
            t("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (d(), o("div", vt, [
            (d(!0), o(K, null, F(fe.value, (i) => (d(), te(nt, {
              key: i.id,
              thesis: i,
              level: 0,
              "thesis-stocks": r.value,
              "expanded-thesis": A.value,
              "editing-cell": h.value,
              "editing-value": f.value,
              onToggle: L,
              onEdit: ue,
              onDelete: ve,
              onAddStock: c,
              onDeleteStock: ie,
              onStartEditCell: ne,
              onSaveEdit: le,
              onCancelEdit: z,
              onGetCellMetadata: ae,
              onUpdateEditingValue: ye
            }, null, 8, ["thesis", "thesis-stocks", "expanded-thesis", "editing-cell", "editing-value"]))), 128))
          ]))
        ])
      ])) : T("", !0),
      E.value ? (d(), o("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[9] || (e[9] = (i) => E.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[8] || (e[8] = D(() => {
          }, ["stop"]))
        }, [
          t("div", mt, [
            t("h3", null, y(v.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            t("button", {
              class: "modal-close",
              onClick: e[2] || (e[2] = (i) => E.value = !1)
            }, "×")
          ]),
          t("div", ft, [
            t("div", yt, [
              t("label", {
                for: v.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, pt),
              Q(t("input", {
                id: v.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[3] || (e[3] = (i) => H.value = i),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, gt), [
                [O, H.value]
              ])
            ]),
            t("div", kt, [
              t("label", {
                for: v.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, bt),
              Q(t("textarea", {
                id: v.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[4] || (e[4] = (i) => X.value = i),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, $t), [
                [O, X.value]
              ])
            ]),
            t("div", Ct, [
              t("label", {
                for: v.value === "add" ? "thesis-parent" : "edit-thesis-parent"
              }, " Parent Thesis ", 8, Tt),
              Q(t("select", {
                id: v.value === "add" ? "thesis-parent" : "edit-thesis-parent",
                "onUpdate:modelValue": e[5] || (e[5] = (i) => Y.value = i)
              }, [
                e[19] || (e[19] = t("option", { value: null }, "None (Root Thesis)", -1)),
                (d(!0), o(K, null, F(me.value, (i) => (d(), o("option", {
                  key: i.id,
                  value: i.id
                }, y(i.title), 9, wt))), 128))
              ], 8, _t), [
                [ke, Y.value]
              ]),
              e[20] || (e[20] = t("small", { class: "form-hint" }, "Select a parent thesis to create a hierarchical structure", -1))
            ])
          ]),
          t("div", Et, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[6] || (e[6] = (i) => v.value === "edit" ? ce() : E.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: e[7] || (e[7] = (i) => v.value === "add" ? re() : he()),
              disabled: !H.value.trim()
            }, y(v.value === "add" ? "Add Thesis" : "Save Changes"), 9, St)
          ])
        ])
      ])) : T("", !0),
      k.value ? (d(), o("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[14] || (e[14] = (i) => k.value = !1)
      }, [
        t("div", {
          class: "modal-content",
          onClick: e[13] || (e[13] = D(() => {
          }, ["stop"]))
        }, [
          t("div", xt, [
            e[21] || (e[21] = t("h3", null, "Add Instrument to Thesis", -1)),
            t("button", {
              class: "modal-close",
              onClick: e[10] || (e[10] = (i) => k.value = !1)
            }, "×")
          ]),
          t("div", It, [
            t("div", At, [
              e[22] || (e[22] = t("label", { for: "stock-symbol" }, "Instrument Symbol *", -1)),
              Q(t("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[11] || (e[11] = (i) => C.value = i),
                type: "text",
                placeholder: "Enter instrument symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: S(W, ["enter"])
              }, null, 544), [
                [O, C.value]
              ])
            ])
          ]),
          t("div", Dt, [
            t("button", {
              class: "btn btn-cancel",
              onClick: e[12] || (e[12] = (i) => k.value = !1)
            }, " Cancel "),
            t("button", {
              class: "btn btn-primary",
              onClick: W,
              disabled: !C.value.trim()
            }, " Add Instrument ", 8, Vt)
          ])
        ])
      ])) : T("", !0),
      t("div", Mt, [
        be($e, {
          name: "toast",
          tag: "div"
        }, {
          default: Ce(() => [
            (d(!0), o(K, null, F(P.value, (i) => (d(), o("div", {
              key: i.id,
              class: j(["toast", `toast-${i.type}`]),
              onClick: (u) => R(i.id)
            }, [
              t("div", Ut, [
                i.type === "success" ? (d(), o("span", Bt, "✅")) : i.type === "error" ? (d(), o("span", Kt, "❌")) : i.type === "warning" ? (d(), o("span", Ft, "⚠️")) : i.type === "info" ? (d(), o("span", qt, "ℹ️")) : T("", !0)
              ]),
              t("div", Lt, [
                t("div", Pt, y(i.title), 1),
                i.message ? (d(), o("div", Qt, y(i.message), 1)) : T("", !0)
              ]),
              t("button", {
                class: "toast-close",
                onClick: D((u) => R(i.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, zt)
            ], 10, Nt))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Rt = /* @__PURE__ */ se(Ht, [["__scopeId", "data-v-10ba14fe"]]), Jt = {
  install(n) {
    n.component("Thesis", Rt);
  }
};
export {
  Rt as Thesis,
  Jt as default
};
