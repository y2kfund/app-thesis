import { defineComponent as K, ref as y, computed as $, createElementBlock as o, openBlock as n, createCommentVNode as m, createElementVNode as s, unref as h, createTextVNode as x, toDisplayString as u, Fragment as M, renderList as N, withModifiers as D, withDirectives as A, vModelText as q, createVNode as U, TransitionGroup as B, withCtx as G, normalizeClass as O } from "vue";
import { useThesisQuery as j, useSupabase as H } from "@y2kfund/core";
import { useQueryClient as J } from "@tanstack/vue-query";
const P = { class: "thesis-card" }, R = {
  key: 0,
  class: "loading"
}, W = {
  key: 1,
  class: "error"
}, X = {
  key: 2,
  class: "thesis-container"
}, Y = { class: "thesis-header" }, Z = { class: "thesis-header-actions" }, ee = { class: "thesis-list" }, te = {
  key: 0,
  class: "thesis-empty"
}, se = {
  key: 1,
  class: "thesis-items"
}, ie = { class: "thesis-content" }, oe = { class: "thesis-title" }, ne = {
  key: 0,
  class: "thesis-description"
}, le = { class: "thesis-meta" }, de = {
  key: 0,
  class: "thesis-date"
}, ae = { class: "thesis-actions" }, re = ["onClick"], ce = ["onClick"], ue = { class: "modal-header" }, he = { class: "modal-body" }, ve = { class: "form-group" }, pe = ["for"], me = ["id"], _e = { class: "form-group" }, fe = ["for"], ye = ["id"], ke = { class: "modal-footer" }, be = ["disabled"], Te = { class: "toast-container" }, ge = ["onClick"], Ce = { class: "toast-icon" }, we = { key: 0 }, Ee = { key: 1 }, $e = { key: 2 }, xe = { key: 3 }, Me = { class: "toast-content" }, Ne = { class: "toast-title" }, De = {
  key: 0,
  class: "toast-message"
}, Ae = ["onClick"], qe = /* @__PURE__ */ K({
  __name: "Thesis",
  props: {
    userId: { default: null }
  },
  emits: ["minimize"],
  setup(_, { emit: T }) {
    const k = T, a = j(), f = H(), g = J(), r = y(!1), l = y("add"), c = y({ title: "", description: "" }), d = y({ id: "", title: "", description: "" }), C = $({
      get: () => l.value === "add" ? c.value.title : d.value.title,
      set: (i) => {
        l.value === "add" ? c.value.title = i : d.value.title = i;
      }
    }), E = $({
      get: () => l.value === "add" ? c.value.description : d.value.description,
      set: (i) => {
        l.value === "add" ? c.value.description = i : d.value.description = i;
      }
    }), b = y([]);
    let F = 0;
    function v(i, t, e) {
      const p = F++;
      b.value.push({ id: p, type: i, title: t, message: e }), setTimeout(() => {
        w(p);
      }, 5e3);
    }
    function w(i) {
      const t = b.value.findIndex((e) => e.id === i);
      t !== -1 && b.value.splice(t, 1);
    }
    function Q() {
      l.value = "add", c.value = { title: "", description: "" }, r.value = !0;
    }
    async function V() {
      if (c.value.title.trim())
        try {
          const { data: i, error: t } = await f.schema("hf").from("thesisMaster").insert([{
            title: c.value.title.trim(),
            description: c.value.description.trim() || null
          }]).select();
          if (t) throw t;
          g.invalidateQueries({ queryKey: ["thesis"] }), c.value = { title: "", description: "" }, r.value = !1, v("success", "Thesis Added", "New thesis has been created successfully");
        } catch (i) {
          console.error("Error adding thesis:", i), v("error", "Error", `Failed to add thesis: ${i.message}`);
        }
    }
    function z(i) {
      d.value = {
        id: i.id,
        title: i.title,
        description: i.description || ""
      }, l.value = "edit", r.value = !0;
    }
    function S() {
      d.value = { id: "", title: "", description: "" }, r.value = !1;
    }
    async function I() {
      if (d.value.title.trim())
        try {
          const { error: i } = await f.schema("hf").from("thesisMaster").update({
            title: d.value.title.trim(),
            description: d.value.description.trim() || null
          }).eq("id", d.value.id);
          if (i) throw i;
          g.invalidateQueries({ queryKey: ["thesis"] }), d.value = { id: "", title: "", description: "" }, r.value = !1, v("success", "Thesis Updated", "Thesis has been updated successfully");
        } catch (i) {
          console.error("Error updating thesis:", i), v("error", "Error", `Failed to update thesis: ${i.message}`);
        }
    }
    async function L(i, t) {
      if (confirm(`Are you sure you want to delete thesis "${t}"?

Note: This will not delete positions associated with this thesis.`))
        try {
          const { error: e } = await f.schema("hf").from("thesisMaster").delete().eq("id", i);
          if (e) throw e;
          g.invalidateQueries({ queryKey: ["thesis"] }), v("success", "Thesis Deleted", "Thesis has been deleted successfully");
        } catch (e) {
          console.error("Error deleting thesis:", e), v("error", "Error", `Failed to delete thesis: ${e.message}`);
        }
    }
    return (i, t) => (n(), o("div", P, [
      h(a).isLoading.value ? (n(), o("div", R, [...t[8] || (t[8] = [
        s("div", { class: "loading-spinner" }, null, -1),
        x(" Loading thesis... ", -1)
      ])])) : h(a).isError.value ? (n(), o("div", W, [
        t[9] || (t[9] = s("h3", null, "Error loading thesis", -1)),
        s("p", null, u(h(a).error.value), 1)
      ])) : h(a).isSuccess.value ? (n(), o("div", X, [
        s("div", Y, [
          t[11] || (t[11] = s("h2", null, "Thesis Management", -1)),
          s("div", Z, [
            s("button", {
              class: "btn btn-primary",
              onClick: Q
            }, [...t[10] || (t[10] = [
              s("span", { class: "icon" }, "➕", -1),
              x(" Add New Thesis ", -1)
            ])]),
            s("button", {
              class: "btn btn-minimize",
              onClick: t[0] || (t[0] = (e) => k("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        s("div", ee, [
          !h(a).data.value || h(a).data.value.length === 0 ? (n(), o("div", te, [...t[12] || (t[12] = [
            s("p", null, 'No thesis found. Click "Add New Thesis" to create one.', -1)
          ])])) : (n(), o("div", se, [
            (n(!0), o(M, null, N(h(a).data.value, (e) => (n(), o("div", {
              key: e.id,
              class: "thesis-item"
            }, [
              s("div", ie, [
                s("div", oe, u(e.title), 1),
                e.description ? (n(), o("div", ne, u(e.description), 1)) : m("", !0),
                s("div", le, [
                  e.created_at ? (n(), o("span", de, " Created: " + u(new Date(e.created_at).toLocaleDateString()), 1)) : m("", !0)
                ])
              ]),
              s("div", ae, [
                s("button", {
                  class: "btn btn-secondary btn-sm",
                  onClick: (p) => z(e),
                  title: "Edit thesis"
                }, " ✏️ Edit ", 8, re),
                s("button", {
                  class: "btn btn-danger btn-sm",
                  onClick: (p) => L(e.id, e.title),
                  title: "Delete thesis"
                }, " 🗑️ Delete ", 8, ce)
              ])
            ]))), 128))
          ]))
        ])
      ])) : m("", !0),
      r.value ? (n(), o("div", {
        key: 3,
        class: "modal-overlay",
        onClick: t[7] || (t[7] = (e) => r.value = !1)
      }, [
        s("div", {
          class: "modal-content",
          onClick: t[6] || (t[6] = D(() => {
          }, ["stop"]))
        }, [
          s("div", ue, [
            s("h3", null, u(l.value === "add" ? "Add New Thesis" : "Edit Thesis"), 1),
            s("button", {
              class: "modal-close",
              onClick: t[1] || (t[1] = (e) => r.value = !1)
            }, "×")
          ]),
          s("div", he, [
            s("div", ve, [
              s("label", {
                for: l.value === "add" ? "thesis-title" : "edit-thesis-title"
              }, " Title * ", 8, pe),
              A(s("input", {
                id: l.value === "add" ? "thesis-title" : "edit-thesis-title",
                "onUpdate:modelValue": t[2] || (t[2] = (e) => C.value = e),
                type: "text",
                placeholder: "Enter thesis title",
                maxlength: "100",
                autofocus: ""
              }, null, 8, me), [
                [q, C.value]
              ])
            ]),
            s("div", _e, [
              s("label", {
                for: l.value === "add" ? "thesis-description" : "edit-thesis-description"
              }, " Description ", 8, fe),
              A(s("textarea", {
                id: l.value === "add" ? "thesis-description" : "edit-thesis-description",
                "onUpdate:modelValue": t[3] || (t[3] = (e) => E.value = e),
                placeholder: "Enter thesis description (optional)",
                rows: "4",
                maxlength: "500"
              }, null, 8, ye), [
                [q, E.value]
              ])
            ])
          ]),
          s("div", ke, [
            s("button", {
              class: "btn btn-cancel",
              onClick: t[4] || (t[4] = (e) => l.value === "edit" ? S() : r.value = !1)
            }, " Cancel "),
            s("button", {
              class: "btn btn-primary",
              onClick: t[5] || (t[5] = (e) => l.value === "add" ? V() : I()),
              disabled: !C.value.trim()
            }, u(l.value === "add" ? "Add Thesis" : "Save Changes"), 9, be)
          ])
        ])
      ])) : m("", !0),
      s("div", Te, [
        U(B, {
          name: "toast",
          tag: "div"
        }, {
          default: G(() => [
            (n(!0), o(M, null, N(b.value, (e) => (n(), o("div", {
              key: e.id,
              class: O(["toast", `toast-${e.type}`]),
              onClick: (p) => w(e.id)
            }, [
              s("div", Ce, [
                e.type === "success" ? (n(), o("span", we, "✅")) : e.type === "error" ? (n(), o("span", Ee, "❌")) : e.type === "warning" ? (n(), o("span", $e, "⚠️")) : e.type === "info" ? (n(), o("span", xe, "ℹ️")) : m("", !0)
              ]),
              s("div", Me, [
                s("div", Ne, u(e.title), 1),
                e.message ? (n(), o("div", De, u(e.message), 1)) : m("", !0)
              ]),
              s("button", {
                class: "toast-close",
                onClick: D((p) => w(e.id), ["stop"]),
                "aria-label": "Close notification"
              }, " × ", 8, Ae)
            ], 10, ge))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Fe = (_, T) => {
  const k = _.__vccOpts || _;
  for (const [a, f] of T)
    k[a] = f;
  return k;
}, Qe = /* @__PURE__ */ Fe(qe, [["__scopeId", "data-v-aa4c4009"]]), Ie = {
  install(_) {
    _.component("Thesis", Qe);
  }
};
export {
  Qe as Thesis,
  Ie as default
};
