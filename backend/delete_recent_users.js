const pool = require('./db');

async function deleteRecentUsers() {
    try {
        console.log('Fetching users registered in the last 5 hours...');

        // First, let's see how many we are deleting
        const checkResult = await pool.query(
            "SELECT id, email, name, created_at FROM users WHERE created_at >= NOW() - INTERVAL '5 hours'"
        );

        console.log(`Found ${checkResult.rowCount} users to delete.`);

        if (checkResult.rowCount > 0) {
            checkResult.rows.forEach(user => {
                console.log(`- ${user.email} (${user.name}) registered at ${user.created_at}`);
            });

            const deleteResult = await pool.query(
                "DELETE FROM users WHERE created_at >= NOW() - INTERVAL '5 hours'"
            );

            console.log(`Successfully deleted ${deleteResult.rowCount} users.`);
        } else {
            console.log('No users found in the specified time range.');
        }
    } catch (err) {
        console.error('Error deleting users:', err);
    } finally {
        pool.end();
    }
}

deleteRecentUsers();
