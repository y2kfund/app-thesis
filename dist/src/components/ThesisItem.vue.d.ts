import { Thesis } from '@y2kfund/core';
interface Props {
    thesis: any;
    level: number;
    thesisStocks: Record<string, any[]>;
    expandedThesis: Set<string>;
    editingCell: any;
    editingValue: any;
    stockResources: Record<string, any[]>;
}
declare const _default: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    toggle: (thesisId: string) => any;
    edit: (thesis: Thesis) => any;
    delete: (id: string, title: string) => any;
    "add-stock": (thesisId: string) => any;
    "delete-stock": (thesisId: string, stockId: string, symbol: string) => any;
    "start-edit-cell": (thesisId: string, stock: any, field: string) => any;
    "save-edit": (stock: any, field: string) => any;
    "cancel-edit": () => any;
    "get-cell-metadata": (stock: any, field: string) => any;
    "update-editing-value": (value: any) => any;
    "add-resource": (thesisId: string, stockId: string) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onToggle?: ((thesisId: string) => any) | undefined;
    onEdit?: ((thesis: Thesis) => any) | undefined;
    onDelete?: ((id: string, title: string) => any) | undefined;
    "onAdd-stock"?: ((thesisId: string) => any) | undefined;
    "onDelete-stock"?: ((thesisId: string, stockId: string, symbol: string) => any) | undefined;
    "onStart-edit-cell"?: ((thesisId: string, stock: any, field: string) => any) | undefined;
    "onSave-edit"?: ((stock: any, field: string) => any) | undefined;
    "onCancel-edit"?: (() => any) | undefined;
    "onGet-cell-metadata"?: ((stock: any, field: string) => any) | undefined;
    "onUpdate-editing-value"?: ((value: any) => any) | undefined;
    "onAdd-resource"?: ((thesisId: string, stockId: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    tableRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
