import { defineComponent as _e, ref as v, watch as me, computed as se, createElementBlock as l, openBlock as n, createCommentVNode as C, createElementVNode as s, unref as $, createTextVNode as oe, toDisplayString as r, Fragment as P, renderList as R, withDirectives as T, withKeys as k, vModelText as K, vModelCheckbox as ie, withModifiers as G, createVNode as ye, TransitionGroup as fe, withCtx as ke, normalizeClass as be } from "vue";
import { useThesisQuery as ge, useSupabase as we } from "@y2kfund/core";
import { useQueryClient as Ce } from "@tanstack/vue-query";
const $e = { class: "thesis-card" }, Te = {
  key: 0,
  class: "loading"
}, Ee = {
  key: 1,
  class: "error"
}, Se = {
  key: 2,
  class: "thesis-container"
}, xe = { class: "thesis-header" }, De = { class: "thesis-header-actions" }, Ae = { class: "thesis-list" }, Me = {
  key: 0,
  class: "thesis-empty"
}, Ke = {
  key: 1,
  class: "thesis-items"
}, Ne = { class: "thesis-item" }, Ue = ["onClick"], Ve = { class: "thesis-expand-icon" }, Be = { class: "thesis-info" }, Fe = { class: "thesis-title" }, Ie = {
  key: 0,
  class: "thesis-description"
}, qe = { class: "thesis-meta" }, Le = {
  key: 0,
  class: "thesis-date"
}, Qe = { class: "thesis-stock-count" }, ze = { class: "thesis-actions" }, Pe = ["onClick"], Re = ["onClick"], Ge = {
  key: 0,
  class: "stocks-section"
}, Oe = { class: "stocks-header" }, je = ["onClick"], He = {
  key: 0,
  class: "stocks-empty"
}, Je = {
  key: 1,
  class: "stocks-table-wrapper"
}, We = { class: "stocks-table" }, Xe = { class: "stock-symbol" }, Ye = ["title", "onDblclick"], Ze = ["onBlur", "onKeyup"], et = { key: 1 }, tt = ["title", "onDblclick"], st = ["onBlur", "onKeyup"], ot = { key: 1 }, it = ["title", "onDblclick"], lt = ["onBlur", "onKeyup"], nt = { key: 1 }, at = ["title", "onDblclick"], dt = ["onBlur", "onKeyup"], rt = { key: 1 }, ct = { class: "stock-actions" }, ut = ["onClick"], vt = { class: "modal-header" }, ht = { class: "modal-body" }, pt = { class: "form-group" }, _t = ["for"], mt = ["id"], yt = { class: "form-group" }, ft = ["for"], kt = ["id"], bt = { class: "modal-footer" }, gt = ["disabled"], wt = { class: "modal-header" }, Ct = { class: "modal-body" }, $t = { class: "form-group" }, Tt = { class: "modal-footer" }, Et = ["disabled"], St = { class: "toast-container" }, xt = ["onClick"], Dt = { class: "toast-icon" }, At = { key: 0 }, Mt = { key: 1 }, Kt = { key: 2 }, Nt = { key: 3 }, Ut = { class: "toast-content" }, Vt = { class: "toast-title" }, Bt = {
  key: 0,
  class: "toast-message"
}, Ft = ["onClick"], It = /* @__PURE__ */ _e({
  __name: "Thesis",
  props: {
    userId: { default: null }
  },
  emits: ["minimize"],
  setup(E, { emit: F }) {
    const N = E, I = F, m = ge(), b = we(), q = Ce(), x = v({}), h = v(null), p = v(null), S = v(!1), L = v(""), g = v(""), D = v(/* @__PURE__ */ new Set());
    async function A() {
      try {
        const { data: o, error: e } = await b.schema("hf").from("thesisStocks").select("*").order("symbol");
        if (e) throw e;
        const t = {};
        o == null || o.forEach((a) => {
          t[a.thesis_id] || (t[a.thesis_id] = []), t[a.thesis_id].push(a);
        }), x.value = t;
      } catch (o) {
        console.error("Error loading thesis stocks:", o), u("error", "Error", `Failed to load stocks: ${o.message}`);
      }
    }
    me(() => m.data.value, (o) => {
      o && o.length > 0 && A();
    }, { immediate: !0 });
    function le(o) {
      D.value.has(o) ? D.value.delete(o) : D.value.add(o);
    }
    function ne(o) {
      L.value = o, g.value = "", S.value = !0;
    }
    async function O() {
      if (!(!g.value.trim() || !L.value))
        try {
          const { data: o, error: e } = await b.schema("hf").from("thesisStocks").insert([{
            thesis_id: L.value,
            symbol: g.value.trim().toUpperCase(),
            pe_ratio: null,
            peg_ratio: null,
            passed_checks: !1,
            currently_held: !1
          }]).select();
          if (e) throw e;
          await A(), g.value = "", S.value = !1, u("success", "Stock Added", `${g.value} has been added to the thesis`);
        } catch (o) {
          console.error("Error adding stock:", o), u("error", "Error", `Failed to add stock: ${o.message}`);
        }
    }
    async function ae(o, e, t) {
      if (confirm(`Are you sure you want to remove ${t} from this thesis?`))
        try {
          const { error: a } = await b.schema("hf").from("thesisStocks").delete().eq("id", e);
          if (a) throw a;
          await A(), u("success", "Stock Removed", `${t} has been removed from the thesis`);
        } catch (a) {
          console.error("Error deleting stock:", a), u("error", "Error", `Failed to remove stock: ${a.message}`);
        }
    }
    function U(o, e, t) {
      h.value = { thesisId: o, stockId: e.id, field: t }, p.value = e[t];
    }
    function M() {
      h.value = null, p.value = null;
    }
    async function w(o, e) {
      if (h.value)
        try {
          const t = {
            [e]: p.value,
            [`${e}_updated_by`]: N.userId,
            [`${e}_updated_at`]: (/* @__PURE__ */ new Date()).toISOString()
          }, { error: a } = await b.schema("hf").from("thesisStocks").update(t).eq("id", o.id);
          if (a) throw a;
          await A(), M(), u("success", "Updated", `${e.replace("_", " ")} has been updated`);
        } catch (t) {
          console.error("Error updating stock:", t), u("error", "Error", `Failed to update: ${t.message}`);
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
    const y = v(!1), c = v("add"), f = v({ title: "", description: "" }), _ = v({ id: "", title: "", description: "" }), Q = se({
      get: () => c.value === "add" ? f.value.title : _.value.title,
      set: (o) => {
        c.value === "add" ? f.value.title = o : _.value.title = o;
      }
    }), j = se({
      get: () => c.value === "add" ? f.value.description : _.value.description,
      set: (o) => {
        c.value === "add" ? f.value.description = o : _.value.description = o;
      }
    }), B = v([]);
    let de = 0;
    function u(o, e, t) {
      const a = de++;
      B.value.push({ id: a, type: o, title: e, message: t }), setTimeout(() => {
        z(a);
      }, 5e3);
    }
    function z(o) {
      const e = B.value.findIndex((t) => t.id === o);
      e !== -1 && B.value.splice(e, 1);
    }
    function re() {
      c.value = "add", f.value = { title: "", description: "" }, y.value = !0;
    }
    async function ce() {
      if (f.value.title.trim())
        try {
          const { data: o, error: e } = await b.schema("hf").from("thesisMaster").insert([{
            title: f.value.title.trim(),
            description: f.value.description.trim() || null
          }]).select();
          if (e) throw e;
          q.invalidateQueries({ queryKey: ["thesis"] }), f.value = { title: "", description: "" }, y.value = !1, u("success", "Thesis Added", "New thesis has been created successfully");
        } catch (o) {
          console.error("Error adding thesis:", o), u("error", "Error", `Failed to add thesis: ${o.message}`);
        }
    }
    function ue(o) {
      _.value = {
        id: o.id,
        title: o.title,
        description: o.description || ""
      }, c.value = "edit", y.value = !0;
    }
    function ve() {
      _.value = { id: "", title: "", description: "" }, y.value = !1;
    }
    async function he() {
      if (_.value.title.trim())
        try {
          const { error: o } = await b.schema("hf").from("thesisMaster").update({
            title: _.value.title.trim(),
            description: _.value.description.trim() || null
          }).eq("id", _.value.id);
          if (o) throw o;
          q.invalidateQueries({ queryKey: ["thesis"] }), _.value = { id: "", title: "", description: "" }, y.value = !1, u("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (o) {
          console.error("Error updating thesis:", o), u("error", "Error", `Failed to update thesis: ${o.message}`);
        }
    }
    async function pe(o, e) {
      if (confirm(`Are you sure you want to delete thesis "${e}"?

Note: This will also delete all stocks associated with this thesis.`))
        try {
          await b.schema("hf").from("thesisStocks").delete().eq("thesis_id", o);
          const { error: t } = await b.schema("hf").from("thesisMaster").delete().eq("id", o);
          if (t) throw t;
          q.invalidateQueries({ queryKey: ["thesis"] }), await A(), u("success", "Thesis Deleted", "Thesis and associated stocks have been deleted successfully");
        } catch (t) {
          console.error("Error deleting thesis:", t), u("error", "Error", `Failed to delete thesis: ${t.message}`);
        }
    }
    return (o, e) => (n(), l("div", $e, [
      $(m).isLoading.value ? (n(), l("div", Te, [...e[17] || (e[17] = [
        s("div", { class: "loading-spinner" }, null, -1),
        oe(" Loading thesis... ", -1)
      ])])) : $(m).isError.value ? (n(), l("div", Ee, [
        e[18] || (e[18] = s("h3", null, "Error loading thesis", -1)),
        s("p", null, r($(m).error.value), 1)
      ])) : $(m).isSuccess.value ? (n(), l("div", Se, [
        s("div", xe, [
          e[20] || (e[20] = s("h2", null, "Thesis Management", -1)),
          s("div", De, [
            s("button", {
              class: "btn btn-primary",
              onClick: re
            }, [...e[19] || (e[19] = [
              s("span", { class: "icon" }, "➕", -1),
              oe(" Add New Thesis ", -1)
            ])]),
            s("button", {
              class: "btn btn-minimize",
              onClick: e[0] || (e[0] = (t) => I("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        s("div", Ae, [
          !$(m).data.value || $(m).data.value.length === 0 ? (n(), l("div", Me, [...e[21] || (e[21] = [
            s("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (n(), l("div", Ke, [
            (n(!0), l(P, null, R($(m).data.value, (t) => {
              var a;
              return n(), l("div", {
                key: t.id,
                class: "thesis-item-wrapper"
              }, [
                s("div", Ne, [
                  s("div", {
                    class: "thesis-content",
                    onClick: (i) => le(t.id)
                  }, [
                    s("div", Ve, r(D.value.has(t.id) ? "▼" : "▶"), 1),
                    s("div", Be, [
                      s("div", Fe, r(t.title), 1),
                      t.description ? (n(), l("div", Ie, r(t.description), 1)) : C("", !0),
                      s("div", qe, [
                        t.created_at ? (n(), l("span", Le, " Created: " + r(new Date(t.created_at).toLocaleDateString()), 1)) : C("", !0),
                        s("span", Qe, r(((a = x.value[t.id]) == null ? void 0 : a.length) || 0) + " stocks ", 1)
                      ])
                    ])
                  ], 8, Ue),
                  s("div", ze, [
                    s("button", {
                      class: "btn btn-secondary btn-sm",
                      onClick: (i) => ue(t),
                      title: "Edit thesis"
                    }, " ✏️ Edit ", 8, Pe),
                    s("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => pe(t.id, t.title),
                      title: "Delete thesis"
                    }, " 🗑️ Delete ", 8, Re)
                  ])
                ]),
                D.value.has(t.id) ? (n(), l("div", Ge, [
                  s("div", Oe, [
                    e[22] || (e[22] = s("h4", null, "Stocks", -1)),
                    s("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => ne(t.id)
                    }, " ➕ Add Stock ", 8, je)
                  ]),
                  !x.value[t.id] || x.value[t.id].length === 0 ? (n(), l("div", He, ' No stocks added yet. Click "Add Stock" to add one. ')) : (n(), l("div", Je, [
                    s("table", We, [
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
                        (n(!0), l(P, null, R(x.value[t.id], (i) => {
                          var H, J, W, X, Y, Z, ee, te;
                          return n(), l("tr", {
                            key: i.id
                          }, [
                            s("td", Xe, r(i.symbol), 1),
                            s("td", {
                              class: "editable-cell",
                              title: V(i, "pe_ratio"),
                              onDblclick: (d) => U(t.id, i, "pe_ratio")
                            }, [
                              ((H = h.value) == null ? void 0 : H.stockId) === i.id && ((J = h.value) == null ? void 0 : J.field) === "pe_ratio" ? T((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[1] || (e[1] = (d) => p.value = d),
                                type: "number",
                                step: "0.01",
                                onBlur: (d) => w(i, "pe_ratio"),
                                onKeyup: [
                                  k((d) => w(i, "pe_ratio"), ["enter"]),
                                  k(M, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, Ze)), [
                                [
                                  K,
                                  p.value,
                                  void 0,
                                  { number: !0 }
                                ]
                              ]) : (n(), l("span", et, r(i.pe_ratio ?? "-"), 1))
                            ], 40, Ye),
                            s("td", {
                              class: "editable-cell",
                              title: V(i, "peg_ratio"),
                              onDblclick: (d) => U(t.id, i, "peg_ratio")
                            }, [
                              ((W = h.value) == null ? void 0 : W.stockId) === i.id && ((X = h.value) == null ? void 0 : X.field) === "peg_ratio" ? T((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[2] || (e[2] = (d) => p.value = d),
                                type: "number",
                                step: "0.01",
                                onBlur: (d) => w(i, "peg_ratio"),
                                onKeyup: [
                                  k((d) => w(i, "peg_ratio"), ["enter"]),
                                  k(M, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, st)), [
                                [
                                  K,
                                  p.value,
                                  void 0,
                                  { number: !0 }
                                ]
                              ]) : (n(), l("span", ot, r(i.peg_ratio ?? "-"), 1))
                            ], 40, tt),
                            s("td", {
                              class: "editable-cell checkbox-cell",
                              title: V(i, "passed_checks"),
                              onDblclick: (d) => U(t.id, i, "passed_checks")
                            }, [
                              ((Y = h.value) == null ? void 0 : Y.stockId) === i.id && ((Z = h.value) == null ? void 0 : Z.field) === "passed_checks" ? T((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[3] || (e[3] = (d) => p.value = d),
                                type: "checkbox",
                                onBlur: (d) => w(i, "passed_checks"),
                                onKeyup: [
                                  k((d) => w(i, "passed_checks"), ["enter"]),
                                  k(M, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, lt)), [
                                [ie, p.value]
                              ]) : (n(), l("span", nt, r(i.passed_checks ? "✅" : "❌"), 1))
                            ], 40, it),
                            s("td", {
                              class: "editable-cell checkbox-cell",
                              title: V(i, "currently_held"),
                              onDblclick: (d) => U(t.id, i, "currently_held")
                            }, [
                              ((ee = h.value) == null ? void 0 : ee.stockId) === i.id && ((te = h.value) == null ? void 0 : te.field) === "currently_held" ? T((n(), l("input", {
                                key: 0,
                                "onUpdate:modelValue": e[4] || (e[4] = (d) => p.value = d),
                                type: "checkbox",
                                onBlur: (d) => w(i, "currently_held"),
                                onKeyup: [
                                  k((d) => w(i, "currently_held"), ["enter"]),
                                  k(M, ["escape"])
                                ],
                                autofocus: ""
                              }, null, 40, dt)), [
                                [ie, p.value]
                              ]) : (n(), l("span", rt, r(i.currently_held ? "✅" : "❌"), 1))
                            ], 40, at),
                            s("td", ct, [
                              s("button", {
                                class: "btn btn-danger btn-xs",
                                onClick: (d) => ae(t.id, i.id, i.symbol),
                                title: "Remove stock"
                              }, " 🗑️ ", 8, ut)
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]))
                ])) : C("", !0)
              ]);
            }), 128))
          ]))
        ])
      ])) : C("", !0),
      y.value ? (n(), l("div", {
        key: 3,
        class: "modal-overlay",
        onClick: e[11] || (e[11] = (t) => y.value = !1)
      }, [
        s("div", {
          class: "modal-content",
          onClick: e[10] || (e[10] = G(() => {
          }, ["stop"]))
        }, [
          s("div", vt, [
            s("h3", null, r(c.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            s("button", {
              class: "modal-close",
              onClick: e[5] || (e[5] = (t) => y.value = !1)
            }, "×")
          ]),
          s("div", ht, [
            s("div", pt, [
              s("label", {
                for: c.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, _t),
              T(s("input", {
                id: c.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": e[6] || (e[6] = (t) => Q.value = t),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, mt), [
                [K, Q.value]
              ])
            ]),
            s("div", yt, [
              s("label", {
                for: c.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, ft),
              T(s("textarea", {
                id: c.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": e[7] || (e[7] = (t) => j.value = t),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, kt), [
                [K, j.value]
              ])
            ])
          ]),
          s("div", bt, [
            s("button", {
              class: "btn btn-cancel",
              onClick: e[8] || (e[8] = (t) => c.value === "edit" ? ve() : y.value = !1)
            }, " Cancel "),
            s("button", {
              class: "btn btn-primary",
              onClick: e[9] || (e[9] = (t) => c.value === "add" ? ce() : he()),
              disabled: !Q.value.trim()
            }, r(c.value === "add" ? "Add Thesis" : "Save Changes"), 9, gt)
          ])
        ])
      ])) : C("", !0),
      S.value ? (n(), l("div", {
        key: 4,
        class: "modal-overlay",
        onClick: e[16] || (e[16] = (t) => S.value = !1)
      }, [
        s("div", {
          class: "modal-content",
          onClick: e[15] || (e[15] = G(() => {
          }, ["stop"]))
        }, [
          s("div", wt, [
            e[24] || (e[24] = s("h3", null, "Add Stock to Thesis", -1)),
            s("button", {
              class: "modal-close",
              onClick: e[12] || (e[12] = (t) => S.value = !1)
            }, "×")
          ]),
          s("div", Ct, [
            s("div", $t, [
              e[25] || (e[25] = s("label", { for: "stock-symbol" }, "Stock Symbol *", -1)),
              T(s("input", {
                id: "stock-symbol",
                "onUpdate:modelValue": e[13] || (e[13] = (t) => g.value = t),
                type: "text",
                placeholder: "Enter stock symbol (e.g., AAPL)",
                maxlength: "10",
                autofocus: "",
                onKeyup: k(O, ["enter"])
              }, null, 544), [
                [K, g.value]
              ])
            ])
          ]),
          s("div", Tt, [
            s("button", {
              class: "btn btn-cancel",
              onClick: e[14] || (e[14] = (t) => S.value = !1)
            }, " Cancel "),
            s("button", {
              class: "btn btn-primary",
              onClick: O,
              disabled: !g.value.trim()
            }, " Add Stock ", 8, Et)
          ])
        ])
      ])) : C("", !0),
      s("div", St, [
        ye(fe, {
          name: "toast",
          tag: "div"
        }, {
          default: ke(() => [
            (n(!0), l(P, null, R(B.value, (t) => (n(), l("div", {
              key: t.id,
              class: be(["toast", `toast-${t.type}`]),
              onClick: (a) => z(t.id)
            }, [
              s("div", Dt, [
                t.type === "success" ? (n(), l("span", At, "✅")) : t.type === "error" ? (n(), l("span", Mt, "❌")) : t.type === "warning" ? (n(), l("span", Kt, "⚠️")) : t.type === "info" ? (n(), l("span", Nt, "ℹ️")) : C("", !0)
              ]),
              s("div", Ut, [
                s("div", Vt, r(t.title), 1),
                t.message ? (n(), l("div", Bt, r(t.message), 1)) : C("", !0)
              ]),
              s("button", {
                class: "toast-close",
                onClick: G((a) => z(t.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, Ft)
            ], 10, xt))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), qt = (E, F) => {
  const N = E.__vccOpts || E;
  for (const [I, m] of F)
    N[I] = m;
  return N;
}, Lt = /* @__PURE__ */ qt(It, [["__scopeId", "data-v-020c1959"]]), Rt = {
  install(E) {
    E.component("Thesis", Lt);
  }
};
export {
  Lt as Thesis,
  Rt as default
};
