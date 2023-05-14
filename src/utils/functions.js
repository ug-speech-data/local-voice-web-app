export const mod = (n, m) => (n % m + m) % m;


export const needlemanWunsch = (seq1, seq2) => {
    const m = seq1.length;
    const n = seq2.length;
    let gap_penalty = -2;
    let match_score = 1;
    let mismatch_penalty = -1;

    // Initialize the scoring matrix
    const score = [];
    for (let i = 0; i <= m; i++) {
        score[i] = [];
        for (let j = 0; j <= n; j++) {
            score[i][j] = 0;
        }
    }

    // Initialize the first row and column of the scoring matrix
    for (let i = 1; i <= m; i++) {
        score[i][0] = score[i - 1][0] + gap_penalty;
    }
    for (let j = 1; j <= n; j++) {
        score[0][j] = score[0][j - 1] + gap_penalty;
    }

    // Fill in the rest of the scoring matrix
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            let diagScore = score[i - 1][j - 1] + (seq1[i - 1] == seq2[j - 1] ? match_score : mismatch_penalty);
            let leftScore = score[i][j - 1] + gap_penalty;
            let upScore = score[i - 1][j] + gap_penalty;

            score[i][j] = Math.max(diagScore, leftScore, upScore);
        }
    }

    // Traceback
    let align1 = "";
    let align2 = "";
    let i = m;
    let j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && score[i][j] == score[i - 1][j - 1] + (seq1[i - 1] == seq2[j - 1] ? match_score : mismatch_penalty)) {
            align1 = seq1[i - 1] + align1;
            align2 = seq2[j - 1] + align2;
            i--;
            j--;
        } else if (j > 0 && score[i][j] == score[i][j - 1] + gap_penalty) {
            align1 = "-" + align1;
            align2 = seq2[j - 1] + align2;
            j--;
        } else {
            align1 = seq1[i - 1] + align1;
            align2 = "-" + align2;
            i--;
        }
    }

    return [align1, align2, score[m][n]];
}
