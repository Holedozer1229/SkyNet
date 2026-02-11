use anchor_lang::prelude::*;

#[account]
pub struct Difficulty {
    pub value: u128,
    pub last_update: i64,
    pub halving_period: i64,
}

pub fn initialize_difficulty(difficulty: &mut Difficulty) -> Result<()> {
    difficulty.value = u128::MAX / 1_000_000; // initial target
    difficulty.last_update = Clock::get()?.unix_timestamp;
    difficulty.halving_period = 210_000; // block count
    Ok(())
}

pub fn update_difficulty(difficulty: &mut Difficulty) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    if now - difficulty.last_update > difficulty.halving_period {
        difficulty.value /= 2;
        difficulty.last_update = now;
    }
    Ok(())
}

impl Difficulty {
    pub fn current_target(&self) -> u128 {
        self.value
    }
}
