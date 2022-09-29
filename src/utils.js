export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function calculateRewards(transactionData) {

    const pointsWiseTransaction = transactionData.map(transaction => {
        let points = 0;
        let over100 = transaction.points - 100;

        if (over100 > 0) {
            points += (over100 * 2);
        }
        if (transaction.points > 50) {
            points += 50;
        }
        const month = new Date(transaction.transactionDt).getMonth();
        return { ...transaction, points, month };
    });

    let byCustomer = {};
    let totalPointsByCustomer = {};
    pointsWiseTransaction.forEach(pointsWiseTransaction => {
        let { customerId, name, month, points } = pointsWiseTransaction;
        if (!byCustomer[customerId]) {
            byCustomer[customerId] = [];
        }
        if (!totalPointsByCustomer[name]) {
            totalPointsByCustomer[name] = 0;
        }
        totalPointsByCustomer[name] += points;
        if (byCustomer[customerId][month]) {
            byCustomer[customerId][month].points += points;
            byCustomer[customerId][month].monthNumber = month;
            byCustomer[customerId][month].numTransactions++;
        }
        else {
            byCustomer[customerId][month] = {
                customerId,
                name,
                monthNumber: month,
                month: months[month],
                numTransactions: 1,
                points
            }
        }
    });
    let tot = [];
    for (var custKey in byCustomer) {
        byCustomer[custKey].forEach(cRow => {
            tot.push(cRow);
        });
    }
    let totByCustomer = [];
    for (custKey in totalPointsByCustomer) {
        totByCustomer.push({
            name: custKey,
            points: totalPointsByCustomer[custKey]
        });
    }
    return {
        transactions: tot,
        pointsWiseTransaction,
        totalPointsByCustomer: totByCustomer
    };
}