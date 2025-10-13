import { defineComponent as ye, ref as v, watch as be, computed as oe, createElementBlock as l, openBlock as n, createCommentVNode as $, createElementVNode as s, unref as T, createTextVNode as ie, toDisplayString as r, normalizeClass as le, Fragment as R, renderList as H, withDirectives as E, withKeys as g, vModelText as K, vModelCheckbox as ne, withModifiers as G, createVNode as ke, TransitionGroup as ge, withCtx as we } from "vue";
import { useThesisQuery as Ce, useSupabase as $e } from "@y2kfund/core";
import { useQueryClient as Te } from "@tanstack/vue-query";
const Ee = { class: "thesis-card" }, Se = {
  key: 0,
  class: "loading"
}, xe = {
  key: 1,
  class: "error"
}, Ie = {
  key: 2,
  class: "thesis-container"
}, De = { class: "thesis-header" }, Ae = { class: "thesis-header-actions" }, Ue = { class: "thesis-list" }, Me = {
  key: 0,
  class: "thesis-empty"
}, Ke = {
  key: 1,
  class: "thesis-items"
}, Ne = { class: "thesis-item" }, Be = ["onClick"], Ve = { class: "thesis-expand-icon" }, Fe = { class: "thesis-info" }, qe = { class: "thesis-title" }, Le = {
  key: 0,
  class: "thesis-description"
}, Qe = { class: "thesis-meta" }, ze = {
  key: 0,
  class: "thesis-date"
}, Pe = { class: "thesis-stock-count" }, Re = { class: "thesis-actions" }, He = ["onClick"], Ge = ["onClick"], Oe = {
  key: 0,
  class: "stocks-section"
}, je = { class: "stocks-header" }, Je = ["onClick"], We = {
  key: 0,
  class: "stocks-empty"
}, Xe = {
  key: 1,
  class: "stocks-table-wrapper"
}, Ye = { class: "stocks-table" }, Ze = { class: "stock-symbol" }, et = ["title", "onDblclick"], tt = ["onBlur", "onKeyup"], st = { key: 1 }, ot = ["title", "onDblclick"], it = ["onBlur", "onKeyup"], lt = { key: 1 }, nt = ["title", "onDblclick"], at = ["onBlur", "onKeyup"], dt = { key: 1 }, rt = ["title", "onDblclick"], ut = ["onBlur", "onKeyup"], ct = { key: 1 }, vt = { class: "stock-actions" }, ht = ["onClick"], pt = { class: "modal-header" }, mt = { class: "modal-body" }, _t = { class: "form-group" }, ft = ["for"], yt = ["id"], bt = { class: "form-group" }, kt = ["for"], gt = ["id"], wt = { class: "modal-footer" }, Ct = ["disabled"], $t = { class: "modal-header" }, Tt = { class: "modal-body" }, Et = { class: "form-group" }, St = { class: "modal-footer" }, xt = ["disabled"], It = { class: "toast-container" }, Dt = ["onClick"], At = { class: "toast-icon" }, Ut = { key: 0 }, Mt = { key: 1 }, Kt = { key: 2 }, Nt = { key: 3 }, Bt = { class: "toast-content" }, Vt = { class: "toast-title" }, Ft = {
  key: 0,
  class: "toast-message"
}, qt = ["onClick"], Lt = /* @__PURE__ */ ye({
  __name: "Thesis",
  props: {
    userId: { default: null },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(S, { emit: q }) {
    const f = S, N = q, _ = Ce(), y = $e(), L = Te(), x = v("");
    async function ae() {
      var o;
      try {
        const { data: { user: e } } = await y.auth.getUser();
        e != null && e.email ? x.value = e.email : (o = e == null ? void 0 : e.user_metadata) != null && o.name ? x.value = e.user_metadata.name : f.userId && (x.value = f.userId);
      } catch (e) {
        console.error("Error fetching current user:", e), f.userId && (x.value = f.userId);
      }
    }
    ae();
    const A = v({}), h = v(null), p = v(null), I = v(!1), Q = v(""), w = v(""), U = v(/* @__PURE__ */ new Set());
    async function M() {
      try {
        const { data: o, error: e } = await y.schema("hf").from("thesisStocks").select("*").order("symbol");
        if (e) throw e;
        const t = {};
        o == null || o.forEach((a) => {
          t[a.thesis_id] || (t[a.thesis_id] = []), t[a.thesis_id].push(a);
        }), A.value = t;
      } catch (o) {
        console.error("Error loading thesis stocks:", o), c("error", "Error", `Failed to load instruments: ${o.message}`);
      }
    }
    be(() => _.data.value, (o) => {
      o && o.length > 0 && M();
    }, { immediate: !0 });
    function de(o) {
      U.value.has(o) ? U.value.delete(o) : U.value.add(o);
    }
    function re(o) {
      Q.value = o, w.value = "", I.value = !0;
    }
    async function O() {
      if (!(!w.value.trim() || !Q.value))
        try {
          const { data: o, error: e } = await y.schema("hf").from("thesisStocks").insert([{
            thesis_id: Q.value,
            symbol: w.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1
          }]).select();
          if (e) throw e;
          await M(), w.value = "", I.value = !1, c("success", "Instrument Added", `${w.value} has been added to the thesis`);
        } catch (o) {
          console.error("Error adding stock:", o), c("error", "Error", `Failed to add stock: ${o.message}`);
        }
    }
    async function ue(o, e, t) {
      if (confirm(`Are you sure you want to remove ${t} from this thesis?`))
        try {
          const { error: a } = await y.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (a) throw a;
          await M(), c("success", "Instrument Removed", `${t} has been removed from the thesis`);
        } catch (a) {
          console.error("Error deleting stock:", a), c("error", "Error", `Failed to remove stock: ${a.message}`);
        }
    }
    function B(o, e, t) {
      h.value = { thesisId: o, stockId: e.id, field: t }, p.value = e[t];
    }
    function D() {
      h.value = null, p.value = null;
    }
    async function C(o, e) {
      if (h.value) {
        if (!x.value) {
          c("error", "Error", "User information not available"), D();
          return;
        }
        try {
          const t = {
            [e]: p.value,
            [`${e}_updated_by`]: x.value,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: a } = await y.schema("hf").from("thesisStocks").update(t).eq("id", o.id);
          if (a) throw a;
          await M(), D(), c("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (t) {
          console.error("Error updating stock:", t), c("error", "Error", `Failed to update: ${t.message}`);
        }
      }
    }
    function V(o, e) {
      const t = o[`${e}_updated_by`], a = o[`${e}_updated_at`];
      if (t && a) {
        const i = new Date(a).toLocaleString();
        return `Updated by: ${t}
Updated at: ${i}`;
      }
      return "No updates yet";
    }
    const b = v(!1), u = v("add"), k = v({ title: "", description: "" }), m = v({ id: "", title: "", description: "" }), z = oe({
      get: () => u.value === "add" ? k.value.title : m.value.title,
      set: (o) => {
        u.value === "add" ? k.value.title = o : m.value.title = o;
      }
    }), j = oe({
      get: () => u.value === "add" ? k.value.description : m.value.description,
      set: (o) => {
        u.value === "add" ? k.value.description = o : m.value.description = o;
      }
    }), F = v([]);
    let ce = 0;
    function c(o, e, t) {
      const a = ce++;
      F.value.push({ id: a, type: o, title: e, message: t }), setTimeout(() => {
        P(a);
      }, 5e3);
    }
    function P(o) {
      const e = F.value.findIndex((t) => t.id === o);
      e !== -1 && F.value.splice(e, 1);
    }
    function ve() {
      u.value = "add", k.value = { title: "", description: "" }, b.value = !0;
    }
    async function he() {
      if (k.value.title.trim())
        try {
          const { data: o, error: e } = await y.schema("hf").from("thesisMaster").insert([{
            title: k.value.title.trim(),
            description: k.value.description.trim() || null
          }]).select();
          if (e) throw e;
          L.invalidateQueries({ queryKey: ["thesis"] }), k.value = { title: "", description: "" }, b.value = !1, c("success", "Thesis Added", "New thesis has been created successfully");
        } catch (o) {
          console.error("Error adding thesis:", o), c("error", "Error", `Failed to add thesis: ${o.message}`);
        }
    }
    function pe(o) {
      m.value = {
        id: o.id,
        title: o.title,
        description: o.description || ""
      }, u.value = "edit", b.value = !0;
    }
    function me() {
      m.value = { id: "", title: "", description: "" }, b.value = !1;
    }
    async function _e() {
      if (m.value.title.trim())
        try {
          const { error: o } = await y.schema("hf").from("thesisMaster").update({
            title: m.value.title.trim(),
            description: m.value.description.trim() || null
          }).eq("id", m.value.id);
          if (o) throw o;
          L.invalidateQueries({ queryKey: ["thesis"] }), m.value = { id: "", title: "", description: "" }, b.value = !1, c("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (o) {
          console.error("Error updating thesis:", o), c("error", "Error", `Failed to update thesis: ${o.message}`);
        }
    }
    async function fe(o, e) {
      if (confirm(`Are you sure you want to delete thesis "${e}"?

Note: This will also delete all instruments associated with this thesis.`))
        try {
          await y.schema("hf").from("thesisStocks").delete().eq("thesis_id", o);
          const { error: t } = await y.schema("hf").from("thesisMaster").delete().eq("id", o);
          if (t) throw t;
          L.invalidateQueries({ queryKey: ["thesis"] }), await M(), c("success", "Thesis Deleted", "Thesis and associated instruments have been deleted successfully");
        } catch (t) {
          console.error("Error deleting thesis:", t), c("error", "Error", `Failed to delete thesis: ${t.message}`);
        }
    }
    return (o, e) => (n(), l("div", Ee, [
      T(_).isLoading.value ? (n(), l("div", Se, [...e[18] || (e[18] = [
        s("div", { class: "loading-spinner" }, null, -1),
        ie(" Loading thesis... ", -1)
      ])])) : T(_).isError.value ? (n(), l("div", xe, [
        e[19] || (e[19] = s("h3", null, "Error loading thesis", -1)),
        s("p", null, r(T(_).error.value), 1)
      ])) : T(_).isSuccess.value ? (n(), l("div", Ie, [
        s("div", De, [
          s("h2", {
            class: le({ "thesis-header-clickable": f.showHeaderLink }),
            onClick: e[0] || (e[0] = (t) => f.showHeaderLink && N("navigate"))
          }, " Thesis Management ", 2),
          s("div", Ae, [
            s("button", {
              class: "btn btn-primary",
              onClick: ve
            }, [...e[20] || (e[20] = [
              s("span", { class: "icon" }, "➕", -1),
              ie(" Add New Thesis ", -1)
            ])]),
            s("button", {
              class: "btn btn-minimize",
              onClick: e[1] || (e[1] = (t) => N("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        s("div", Ue, [
          !T(_).data.value || T(_).data.value.length === 0 ? (n(), l("div", Me, [...e[21] || (e[21] = [
            s("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (n(), l("div", Ke, [
            (n(!0), l(R, null, H(T(_).data.value, (t) => {
              var a;
              return n(), l("div", {
                key: t.id,
                class: "thesis-item-wrapper"
              }, [
                s("div", Ne, [
                  s("div", {
                    class: "thesis-content",
                    onClick: (i) => de(t.id)
                  }, [
                    s("div", Ve, r(U.value.has(t.id) ? "▼" : "▶"), 1),
                    s("div", Fe, [
                      s("div", qe, r(t.title), 1),
                      t.description ? (n(), l("div", Le, r(t.description), 1)) : $("", !0),
                      s("div", Qe, [
                        t.created_at ? (n(), l("span", ze, " Created: " + r(new Date(t.created_at).toLocaleDateString()), 1)) : $("", !0),
                        s("span", Pe, r(((a = A.value[t.id]) == null ? void 0 : a.length) || 0) + " instruments ", 1)
                      ])
                    ])
                  ], 8, Be),
                  s("div", Re, [
                    s("button", {
                      class: "btn btn-secondary btn-sm",
                      onClick: (i) => pe(t),
                      title: "Edit thesis"
                    }, " ✏️ Edit ", 8, He),
                    s("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => fe(t.id, t.title),
                      title: "Delete thesis"
                    }, " 🗑️ Delete ", 8, Ge)
                  ])
                ]),
                U.value.has(t.id) ? (n(), l("div", Oe, [
                  s("div", je, [
                    e[22] || (e[22] = s("h4", null, "Instruments", -1)),
                    s("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => re(t.id)
                    }, " ➕ Add Instrument ", 8, Je)
                  ]),
                  !A.value[t.id] || A.value[t.id].length === 0 ? (n(), l("div", We, ' No instruments added yet. Click "Add Instrument" to add one. ')) : (n(), l("div", Xe, [
                    s("table", Ye, [
                      e[23] || (e[23] = s("thead", null, [
                        s("tr", null, [
                          s("th", null, "Symbol"),
                          s("th", null, "PE Ratio"),
                          s("th", null, "PEG Ratio"),
                          s("th", null, "Passed checks to hold in portfolio"),
                          s("th", null, "Currently held in portfolio"),
                          s("th", null, "Actions")
                        ])
                      ], -1)),
                      s("tbody", null, [
                        (n(!0), l(R, null, H(A.value[t.id], (i) => {
                          var J, W, X, Y, Z, ee, te, se;
                          return n(), l("tr", {
                            key: i.id
                          }, [
                            s("td", Ze, r(i.symbol), 1),
                            s("td", {
                              class: "editable-cell",
                              title: V(i, "pe_ratio"),
                              onDblclick: (d) => B(t.id, i, "pe_ratio")
                            }, [
                              ((J = h.value) == null ? void 0 : J.stockId) === i.id && ((W = h.value) == null ? void 0 : W.field) === "pe_ratio" ? E((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[2] || (e[2] = (d) => p.value = d),
                                type: "number",
                                step: "0.01",
                                onBlur: (d) => C(i, "pe_ratio"),
                                onKeyup: [
                                  g((d) => C(i, "pe_ratio"), ["enter"]),
                                  g(D, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, tt)), [
                                [
                                  K,
                                  p.value,
                                  void 0,
                                  { number: !0 }
                                ]
                              ]) : (n(), l("span", st, r(i.pe_ratio ?? "-"), 1))
                            ], 40, et),
                            s("td", {
                              class: "editable-cell",
                              title: V(i, "peg_ratio"),
                              onDblclick: (d) => B(t.id, i, "peg_ratio")
                            }, [
                              ((X = h.value) == null ? void 0 : X.stockId) === i.id && ((Y = h.value) == null ? void 0 : Y.field) === "peg_ratio" ? E((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[3] || (e[3] = (d) => p.value = d),
                                type: "number",
                                step: "0.01",
                                onBlur: (d) => C(i, "peg_ratio"),
                                onKeyup: [
                                  g((d) => C(i, "peg_ratio"), ["enter"]),
                                  g(D, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, it)), [
                                [
                                  K,
                                  p.value,
                                  void 0,
                                  { number: !0 }
                                ]
                              ]) : (n(), l("span", lt, r(i.peg_ratio ?? "-"), 1))
                            ], 40, ot),
                            s("td", {
                              class: "editable-cell checkbox-cell",
                              title: V(i, "passed_checks"),
                              onDblclick: (d) => B(t.id, i, "passed_checks")
                            }, [
                              ((Z = h.value) == null ? void 0 : Z.stockId) === i.id && ((ee = h.value) == null ? void 0 : ee.field) === "passed_checks" ? E((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[4] || (e[4] = (d) => p.value = d),
                                type: "checkbox",
                                onBlur: (d) => C(i, "passed_checks"),
                                onKeyup: [
                                  g((d) => C(i, "passed_checks"), ["enter"]),
                                  g(D, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, at)), [
                                [ne, p.value]
                              ]) : (n(), l("span", dt, r(i.passed_checks ? "✅" : "❌"), 1))
                            ], 40, nt),
                            s("td", {
                              class: "editable-cell checkbox-cell",
                              title: V(i, "currently_held"),
                              onDblclick: (d) => B(t.id, i, "currently_held")
                            }, [
                              ((te = h.value) == null ? void 0 : te.stockId) === i.id && ((se = h.value) == null ? void 0 : se.field) === "currently_held" ? E((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[5] || (e[5] = (d) => p.value = d),
                                type: "checkbox",
                                onBlur: (d) => C(i, "currently_held"),
                                onKeyup: [
                                  g((d) => C(i, "currently_held"), ["enter"]),
                                  g(D, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, ut)), [
                                [ne, p.value]
                              ]) : (n(), l("span", ct, r(i.currently_held ? "✅" : "❌"), 1))
                            ], 40, rt),
                            s("td", vt, [
                              s("button", {
                                class: "btn btn-danger btn-xs",
                                onClick: (d) => ue(t.id, i.id, i.symbol),
                                title: "Remove stock"
                              }, " 🗑️ ", 8, ht)
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]))
                ])) : $("", !0)
              ]);
            }), 128))
          ]))
        ])
      ])) : $("", !0),
      b.value ? (n(), l("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[12] || (e[12] = (t) => b.value = !1)
      }, [
        s("div", {
          class: "modal-content",
          onClick: e[11] || (e[11] = G(() => {
          }, ["stop"]))
        }, [
          s("div", pt, [
            s("h3", null, r(u.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            s("button", {
              class: "modal-close",
              onClick: e[6] || (e[6] = (t) => b.value = !1)
            }, "×")
          ]),
          s("div", mt, [
            s("div", _t, [
              s("label", {
                for: u.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, ft),
              E(s("input", {
                id: u.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[7] || (e[7] = (t) => z.value = t),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, yt), [
                [K, z.value]
              ])
            ]),
            s("div", bt, [
              s("label", {
                for: u.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, kt),
              E(s("textarea", {
                id: u.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[8] || (e[8] = (t) => j.value = t),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, gt), [
                [K, j.value]
              ])
            ])
          ]),
          s("div", wt, [
            s("button", {
              class: "btn btn-cancel",
              onClick: e[9] || (e[9] = (t) => u.value === "edit" ? me() : b.value = !1)
            }, " Cancel "),
            s("button", {
              class: "btn btn-primary",
              onClick: e[10] || (e[10] = (t) => u.value === "add" ? he() : _e()),
              disabled: !z.value.trim()
            }, r(u.value === "add" ? "Add Thesis" : "Save Changes"), 9, Ct)
          ])
        ])
      ])) : $("", !0),
      I.value ? (n(), l("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[17] || (e[17] = (t) => I.value = !1)
      }, [
        s("div", {
          class: "modal-content",
          onClick: e[16] || (e[16] = G(() => {
          }, ["stop"]))
        }, [
          s("div", $t, [
            e[24] || (e[24] = s("h3", null, "Add Instrument to Thesis", -1)),
            s("button", {
              class: "modal-close",
              onClick: e[13] || (e[13] = (t) => I.value = !1)
            }, "×")
          ]),
          s("div", Tt, [
            s("div", Et, [
              e[25] || (e[25] = s("label", { for: "stock-symbol" }, "Instrument Symbol *", -1)),
              E(s("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[14] || (e[14] = (t) => w.value = t),
                type: "text",
                placeholder: "Enter instrument symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: g(O, ["enter"])
              }, null, 544), [
                [K, w.value]
              ])
            ])
          ]),
          s("div", St, [
            s("button", {
              class: "btn btn-cancel",
              onClick: e[15] || (e[15] = (t) => I.value = !1)
            }, " Cancel "),
            s("button", {
              class: "btn btn-primary",
              onClick: O,
              disabled: !w.value.trim()
            }, " Add Instrument ", 8, xt)
          ])
        ])
      ])) : $("", !0),
      s("div", It, [
        ke(ge, {
          name: "toast",
          tag: "div"
        }, {
          default: we(() => [
            (n(!0), l(R, null, H(F.value, (t) => (n(), l("div", {
              key: t.id,
              class: le(["toast", `toast-${t.type}`]),
              onClick: (a) => P(t.id)
            }, [
              s("div", At, [
                t.type === "success" ? (n(), l("span", Ut, "✅")) : t.type === "error" ? (n(), l("span", Mt, "❌")) : t.type === "warning" ? (n(), l("span", Kt, "⚠️")) : t.type === "info" ? (n(), l("span", Nt, "ℹ️")) : $("", !0)
              ]),
              s("div", Bt, [
                s("div", Vt, r(t.title), 1),
                t.message ? (n(), l("div", Ft, r(t.message), 1)) : $("", !0)
              ]),
              s("button", {
                class: "toast-close",
                onClick: G((a) => P(t.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, qt)
            ], 10, Dt))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Qt = (S, q) => {
  const f = S.__vccOpts || S;
  for (const [N, _] of q)
    f[N] = _;
  return f;
}, zt = /* @__PURE__ */ Qt(Lt, [["__scopeId", "data-v-79a19499"]]), Gt = {
  install(S) {
    S.component("Thesis", zt);
  }
};
export {
  zt as Thesis,
  Gt as default
};
