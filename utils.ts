// Should be used for Zonal access.
export enum Zone {
    Root= "Root",
    WorkOn = "WorkOn",
    StockOn = "StockOn",
    Admin = "Admin",
}

// Should be used to verify user access to the categories.
export enum StockOnCategories {
    Biscotti= "Biscotti",
    Stacks = "Stacks",
    Outpost = "Outpost",
    Provisions = "Provisions",
}

export const enum DBCollection {
    STOCKON = "stockon",
}

export const enum Collections {
    ORDERS = "orders",
    CREW_MEMBERS = "crew_members",
    POINTS = "points",
}
