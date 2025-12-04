import SeatMap from "../models/SeatMap.js";

/**
 * Generate a unique seat map for a theatre
 * Each theatre gets a different layout (rows, columns, aisle positions)
 */
export const generateSeatMapForTheatre = async (theatreId, theatreName, screenName = "Screen 1") => {
    try {
        // Check if seat map already exists for this theatre and screen
        const existingSeatMap = await SeatMap.findOne({ 
            name: `${theatreName} - ${screenName}` 
        });

        if (existingSeatMap) {
            return existingSeatMap._id;
        }

        // Generate random layout parameters for variety
        const rowCounts = [8, 10, 12, 14, 16];
        const colCounts = [12, 14, 16, 18, 20];
        const aislePositions = [
            [4, 8],
            [5, 10],
            [6, 12],
            [4, 9, 14],
            [5, 11]
        ];

        // Use theatre ID to generate consistent but unique layout
        const seed = theatreId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rows = rowCounts[seed % rowCounts.length];
        const cols = colCounts[seed % colCounts.length];
        const aisles = aislePositions[seed % aislePositions.length];

        // Generate seats
        const seats = [];
        const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Define seat types (Premium, Standard, Economy)
        const getSeatType = (rowIndex, colIndex) => {
            // First 2 rows: Premium
            if (rowIndex < 2) return 'PREMIUM';
            // Last 2 rows: Economy
            if (rowIndex >= rows - 2) return 'ECONOMY';
            // Middle rows: Standard
            return 'STANDARD';
        };

        for (let row = 0; row < rows; row++) {
            for (let col = 1; col <= cols; col++) {
                // Skip aisle columns
                if (aisles.includes(col)) continue;

                const rowLetter = rowLetters[row];
                const seatKey = `${rowLetter}${col}`;
                const seatType = getSeatType(row, col);

                seats.push({
                    row: rowLetter,
                    number: col,
                    seatKey: seatKey,
                    type: seatType
                });
            }
        }

        // Create sections
        const sections = [
            { id: 'premium', label: 'Premium' },
            { id: 'standard', label: 'Standard' },
            { id: 'economy', label: 'Economy' }
        ];

        // Create seat map
        const seatMap = await SeatMap.create({
            name: `${theatreName} - ${screenName}`,
            grid: { rows, cols },
            aisles,
            sections,
            seats
        });

        return seatMap._id;
    } catch (error) {
        console.error('Error generating seat map:', error);
        throw error;
    }
};

