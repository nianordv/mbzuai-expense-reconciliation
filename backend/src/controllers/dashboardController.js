const pool = require("../db/pool");

const getBudgetDashboard = async (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    try {
        // total spending from active RLA transactions
        const totalResult = await pool.query(
            `SELECT COALESCE(SUM(amount_aed), 0) AS total_spent
            FROM transactions
            WHERE is_active = TRUE
                AND EXTRACT(YEAR FROM purchase_date) = $1`,
                [currentYear]
        );

        // spending grouped by purchase category
        const categoryResult = await pool.query(
            `SELECT 
                category,
                COALESCE(SUM(amount_aed), 0) AS total
            FROM transactions
            WHERE is_active = TRUE AND status != 'deleted'
            GROUP BY category
            ORDER BY total DESC`
        );

        // spending grouped by budget items ("purchase for")
        const budgetItemResult = await pool.query(
            `SELECT 
                b.budget_item_id,
                b.item_name,
                COALESCE(SUM(amount_aed), 0) AS total
            FROM budget_items b
            LEFT JOIN transactions t 
                ON t.budget_item_id = b.budget_item_id
                AND t.is_active = TRUE
                AND t.status != 'deleted'
            WHERE b.is_active = TRUE
            GROUP BY b.budget_item_id, b.item_name
            ORDER BY total DESC`
        );

        const cardholderResult = await pool.query(
        `SELECT
            c.cardholder_name,
            COALESCE(SUM(t.amount_aed), 0) AS total
        FROM cardholders c
        LEFT JOIN transactions t
            ON t.cardholder_id = c.cardholder_id
            AND t.is_active = TRUE
        GROUP BY c.cardholder_id, c.cardholder_name
        ORDER BY total DESC`
        );
        
        const annualBudgetResult = await pool.query(
            `SELECT planned_amount
            FROM budgets
            WHERE year = $1`,
            [currentYear]
        );

        const annualBudget = Number(
            annualBudgetResult.rows[0]?.planned_amount || 0
        );
        const annualExpenditure = Number(
            totalResult.rows[0].total_spent
        );
        const annualRemaining = annualBudget - annualExpenditure;
        const percentageSpent = annualBudget > 0 ? (annualExpenditure / annualBudget) * 100 : 0;

        const monthlyBudgetResult = await pool.query(
            `SELECT planned_amount 
            FROM monthly_budgets
            WHERE year = $1 AND month = $2`,
            [currentYear, currentMonth]
        );
        const monthlyExpenditureResult = await pool.query(
            `SELECT COALESCE(SUM(amount_aed), 0) AS total_spent
            FROM transactions
            WHERE is_active = TRUE 
                AND EXTRACT(YEAR FROM purchase_date) = $1
                AND EXTRACT(MONTH FROM purchase_date) = $2`,
            [currentYear, currentMonth]
        );

        const monthlyPlanned = Number(
            monthlyBudgetResult.rows[0]?.planned_amount || 0
        );
        const monthlyActual = Number(
            monthlyExpenditureResult.rows[0]?.total_spent
        );
        const monthlyVariance = monthlyPlanned - monthlyActual;
        const monthlyRemaining = Math.max(
            monthlyPlanned - monthlyActual,
            0
        );
        return res.status(200).json({
            success: true,
            summary: {
                annualBudget,
                annualExpenditure,
                annualRemaining,
                percentageSpent,
                monthlyPlanned,
                monthlyActual,
                monthlyVariance,
                monthlyRemaining,
            },
            spendingByCategory: categoryResult.rows.map((row) => ({
                category: row.category || "Uncategorized",
                total: Number(row.total),
            })),
            spendingByBudgetItem: budgetItemResult.rows.map((row) => ({
                itemName: row.item_name,
                total: Number(row.total),
            })),
            spendingByCardholder: cardholderResult.rows.map((row) => ({
            cardholderName: row.cardholder_name,
            total: Number(row.total),
            })),
        });
    } catch (error) {
        console.error("getBudgetDashboard error:", error);

        return res.status(500).json({
        success: false,
        message: "Failed to load budget dashboard data",
        });
    }
};

module.exports = {
  getBudgetDashboard,
};