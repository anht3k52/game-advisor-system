import slugify from 'slugify';
import User from '../models/User.js';
import Article from '../models/Article.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_FULL_NAME = 'Administrator';

const defaultArticles = [
  {
    title: 'Skyward Secrets in The Legend of Zelda: Tears of the Kingdom',
    titleVi: 'Bí mật trên bầu trời trong The Legend of Zelda: Tears of the Kingdom',
    shortDescription:
      'Discover the best routes through the floating islands of Hyrule and learn how to use Ultrahand inventions to glide between skyborne shrines.',
    shortDescriptionVi:
      'Khám phá lộ trình tốt nhất qua các hòn đảo trên không của Hyrule và tận dụng các phát minh Ultrahand để bay đến những đền thờ trên bầu trời.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    content: `## Explore the Sky Islands
The sequel to Breath of the Wild fills the skyline with floating landmasses. Prioritize activating the Skyview Towers to chart your path and unlock fast travel to high-altitude launch pads.

## Master Fuse Combos
Fuse turns everyday objects into powerful weapons. Combine long spears with Zonai blades to extend reach or attach rockets to shields for last-minute glides.

## Recommended Builds
- Stamina-heavy armor sets ensure you can climb every sky ruin.
- Carry a portable cook pot to craft dishes that replenish Zonai energy on the fly.`,
    contentVi: `## Khám phá đảo bay
Phần tiếp theo của Breath of the Wild phủ kín bầu trời bằng những đảo nổi. Hãy ưu tiên kích hoạt các Skyview Tower để mở bản đồ, mở khóa dịch chuyển nhanh và phóng mình lên cao.

## Làm chủ kỹ năng Ghép
Ghép biến vật dụng quen thuộc thành vũ khí mạnh mẽ. Hãy kết hợp giáo dài với lưỡi Zonai để tăng tầm đánh hoặc gắn tên lửa vào khiên để lướt an toàn phút chót.

## Trang bị gợi ý
- Bộ giáp tăng thể lực giúp bạn leo mọi tàn tích trên không.
- Mang theo nồi nấu di động để chế biến món phục hồi năng lượng Zonai ngay lập tức.`,
    tags: ['zelda', 'adventure', 'guide']
  },
  {
    title: 'Elden Ring Build Paths for the Shadow of the Erdtree DLC',
    titleVi: 'Lộ trình xây dựng nhân vật trong Elden Ring: Shadow of the Erdtree',
    shortDescription:
      'Plan a character worthy of the Land of Shadow with new talismans, colossal weapons, and incantations that elevate bleed and holy builds.',
    shortDescriptionVi:
      'Lên kế hoạch nhân vật xứng đáng với Vùng Đất Bóng Tối cùng bùa hộ mệnh, vũ khí khổng lồ và phép thuật mới cho lối chơi chảy máu hoặc ánh sáng.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1598514982833-5fefc0393f80?auto=format&fit=crop&w=1200&q=80',
    content: `## Embrace the Erdtree Relics
Farm the first legacy dungeon to secure talismans that boost holy damage and stamina recovery.

## Bleed Still Reigns
Pair the new katana with Seppuku and White Mask to shred bosses. Keep a faith seal handy for emergency healing.

## Crafting Upgrades
- Spend Smithing Stones on weapons that scale with both dexterity and arcane.
- Mix the new Flask crystal tears to trigger dodge boosts when below half HP.`,
    contentVi: `## Sưu tầm di vật Cây Thánh
Càn quét hầm ngục đầu tiên để sở hữu bùa tăng sát thương ánh sáng và hồi thể lực.

## Lối chơi chảy máu vẫn thống trị
Kết hợp katana mới với kỹ năng Seppuku và mặt nạ Trắng để xé nát trùm. Luôn mang thêm ấn tín đức tin để hồi máu khi khẩn cấp.

## Nâng cấp khôn ngoan
- Dồn Đá Rèn cho vũ khí cộng hưởng cả khéo léo lẫn bí thuật.
- Pha lệ tinh thể mới trong Bình Hỗn Hợp để tăng né đòn khi còn dưới nửa máu.`,
    tags: ['elden-ring', 'build', 'rpg']
  },
  {
    title: 'Baldur\'s Gate 3 Party Synergies You Should Try',
    titleVi: 'Những tổ hợp tổ đội nên thử trong Baldur\'s Gate 3',
    shortDescription:
      'Blend crowd control, burst damage, and battlefield manipulation to conquer Honour Mode or any late-game encounter in style.',
    shortDescriptionVi:
      'Kết hợp khống chế, sát thương bùng nổ và điều khiển chiến trường để vượt qua chế độ Honour hoặc mọi trận cuối game.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1604072366595-e75dc92e3f60?auto=format&fit=crop&w=1200&q=80',
    content: `## Crowd Control Core
Open fights with a Bard or Sorcerer casting Hypnotic Pattern. Follow up with terrain hazards like Spike Growth.

## Burst Windows
Stack Guiding Bolt, Faerie Fire, and Sneak Attack to melt priority targets.

## Party Templates
- Lore Bard, Battle Master, Light Cleric, and Gloom Stalker form a balanced team.
- For Honour Mode, swap in an Oath of the Ancients Paladin for emergency heals.`,
    contentVi: `## Khống chế làm nền tảng
Mở màn bằng việc để Bard hoặc Pháp Sư tung Hypnotic Pattern. Sau đó rải bẫy địa hình như Spike Growth.

## Tạo cửa sát thương lớn
Chồng Guiding Bolt, Faerie Fire và Sneak Attack để thổi bay mục tiêu quan trọng.

## Gợi ý tổ đội
- Bard Tri Thức, Chiến Binh Bậc Thầy, Giáo Sĩ Ánh Sáng và Thợ Săn Bóng Đêm tạo nên đội hình cân bằng.
- Với Honour Mode, hãy đổi sang Paladin Lời Thề Tổ Tiên để cấp cứu kịp thời.`,
    tags: ['baldurs-gate-3', 'strategy', 'rpg']
  },
  {
    title: 'Final Fantasy XVI Eikonic Combo Primer',
    titleVi: 'Hướng dẫn kết hợp Eikon trong Final Fantasy XVI',
    shortDescription:
      'Chain Garuda juggles into Titan counters and Phoenix finishers to keep Clive in stagger bonus mode from start to finish.',
    shortDescriptionVi:
      'Chuỗi Garuda hất tung, Titan phản đòn và Phoenix kết liễu sẽ giúp Clive duy trì trạng thái gây choáng tối đa.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1603484477859-abe6a73f9360?auto=format&fit=crop&w=1200&q=80',
    content: `## Build Your Rotation
Open with Garuda's Rook's Gambit to pop enemies in the air, swap to Titan for counter hits, then finish with Phoenix Shift combos.

## Gear Priorities
Focus accessories that reduce cooldowns on Deadly Embrace and Gouge to reset juggle loops faster.

## Training Route
- Practice in Arete Stone using Stage Replay to memorise windows.
- Record your best chains to study timing between Eikon swaps.`,
    contentVi: `## Xây vòng combo
Bắt đầu bằng Rook's Gambit của Garuda để hất kẻ địch lên, chuyển sang Titan phản đòn rồi kết thúc bằng Phoenix Shift.

## Ưu tiên trang bị
Nhắm đến phụ kiện giảm hồi Deadly Embrace và Gouge để tái lập chuỗi hất nhanh chóng.

## Luyện tập
- Vào Arete Stone với Stage Replay để thuộc các khoảng thời gian.
- Ghi lại chuỗi combo tốt nhất nhằm rèn nhịp đổi Eikon.`,
    tags: ['final-fantasy', 'action', 'guide']
  },
  {
    title: 'Cyberpunk 2077: Phantom Liberty Relic Skill Guide',
    titleVi: 'Hướng dẫn kỹ năng Relic trong Cyberpunk 2077: Phantom Liberty',
    shortDescription:
      'Unlock the best Relic perks and fold them into netrunner, stealth, or chromed-out gorilla builds for Dogtown missions.',
    shortDescriptionVi:
      'Mở khóa các điểm Relic tối ưu và kết hợp vào lối chơi netrunner, lén lút hoặc cận chiến cơ giới cho các nhiệm vụ ở Dogtown.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    content: `## Essential Relic Perks
Prioritise Jailbreak and Emergency Cloaking for flexible stealth or combat escapes.

## Build Paths
- Pair Jailbreak with Kerenzikov for slow-motion melee takedowns.
- Combine Emergency Cloaking with Overclock to hack from safety.

## Dogtown Tips
Hack cameras before every gig and carry EMP grenades to disable turret nests.`,
    contentVi: `## Điểm Relic quan trọng
Ưu tiên Jailbreak và Emergency Cloaking để linh hoạt khi lén lút hoặc rút lui khỏi giao tranh.

## Lộ trình xây dựng
- Ghép Jailbreak với Kerenzikov để hạ cận chiến trong trạng thái làm chậm.
- Kết hợp Emergency Cloaking với Overclock để hack an toàn từ xa.

## Mẹo Dogtown
Luôn hack camera trước mỗi phi vụ và mang lựu đạn EMP để vô hiệu ổ súng máy.`,
    tags: ['cyberpunk-2077', 'build', 'open-world']
  },
  {
    title: 'Starfield Outpost Networks That Actually Pay Off',
    titleVi: 'Mạng lưới tiền đồn Starfield đem lại lợi nhuận',
    shortDescription:
      'Design an interstellar supply chain with automated cargo links that feed shipyards, research labs, and crafting hubs.',
    shortDescriptionVi:
      'Xây dựng chuỗi cung ứng liên hành tinh với đường vận chuyển tự động cho xưởng tàu, phòng nghiên cứu và khu chế tạo.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    content: `## Choose Profitable Planets
Target planets with rare resources like Vytinium and use Survey Slates to confirm abundance before landing.

## Automate Logistics
Place cargo links in triangles so every outpost feeds another. Use four crew slots for bonus extraction speed.

## Sell Smart
- Craft shielded cargo to smuggle contraband collected during supply runs.
- Deliver excess materials to the UC Distribution Centre for steady credits.`,
    contentVi: `## Chọn hành tinh sinh lời
Nhắm đến những hành tinh có khoáng sản hiếm như Vytinium và dùng thiết bị khảo sát để chắc chắn trước khi hạ cánh.

## Tự động hóa vận chuyển
Sắp xếp đường vận chuyển thành hình tam giác để mỗi tiền đồn tiếp tế lẫn nhau. Bổ nhiệm bốn thành viên để tăng tốc khai thác.

## Bán hàng thông minh
- Chế tạo container chống quét để buôn lậu hàng cấm thu được khi vận chuyển.
- Đem vật liệu dư tới trung tâm phân phối UC để nhận tín dụng ổn định.`,
    tags: ['starfield', 'guide', 'simulation']
  },
  {
    title: 'Genshin Impact Fontaine Team Roadmap',
    titleVi: 'Lộ trình xây dựng đội Fontaine trong Genshin Impact',
    shortDescription:
      'Pair Hydro Archon Furina with Arlecchino, Neuvillette, and support units to dominate Spiral Abyss rotations.',
    shortDescriptionVi:
      'Kết hợp Thủy Thần Furina cùng Arlecchino, Neuvillette và các hỗ trợ để làm chủ vòng xoáy Abyss.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1529429617124-aee02041fe72?auto=format&fit=crop&w=1200&q=80',
    content: `## Core Synergies
Furina's Arkhe swaps thrive with characters that can trigger frequent elemental reactions like Neuvillette.

## Support Picks
Bennett and Kazuha remain flexible options. Slot in Charlotte for healing and cryo resonance.

## Abyss Tips
- Save burst rotations for wave two enemies to maximise score.
- Craft Hydro potions to shrug off corrosion effects.`,
    contentVi: `## Liên kết chủ chốt
Cơ chế Arkhe của Furina phát huy tối đa khi đi cùng nhân vật gây phản ứng liên tục như Neuvillette.

## Lựa chọn hỗ trợ
Bennett và Kazuha vẫn rất linh hoạt. Có thể thêm Charlotte để hồi máu và kích hoạt cộng hưởng băng.

## Mẹo Abyss
- Giữ kỹ năng nộ cho đợt quái thứ hai để đạt điểm cao.
- Chế thuốc Thủy để hạn chế sát thương ăn mòn.`,
    tags: ['genshin-impact', 'team-building', 'rpg']
  },
  {
    title: 'Honkai: Star Rail Endgame Relic Farming Routes',
    titleVi: 'Lộ trình farm di vật cuối game Honkai: Star Rail',
    shortDescription:
      'Optimise stamina by looping Cavern of Corrosion domains that reward crit relics for hunters and nihility units.',
    shortDescriptionVi:
      'Tối ưu nhựa bằng cách xoay vòng Cavern of Corrosion để kiếm bộ di vật chí mạng cho nhân vật săn bắn và hư vô.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
    content: `## Priority Sets
Aim for the Wastelander of Banditry Desert for Seele and Inert Salsotto for Jingliu.

## Energy Saving
Always dispatch assignments before farming so you gain bonus materials afterwards.

## Weekly Routine
- Clear Simulated Universe World 8 for planar ornaments.
- Spend remaining stamina on Calyx stages that drop trace mats.`,
    contentVi: `## Bộ di vật ưu tiên
Farm Wastelander of Banditry Desert cho Seele và Inert Salsotto cho Jingliu.

## Tiết kiệm năng lượng
Luôn gửi nhân vật làm nhiệm vụ trước khi farm để nhận thêm nguyên liệu.

## Thói quen hàng tuần
- Vượt Vũ Trụ Mô Phỏng thế giới 8 để lấy trang sức phẳng.
- Dùng nhựa còn lại cho các Calyx rơi nguyên liệu thiên phú.`,
    tags: ['honkai-star-rail', 'guide', 'mobile']
  },
  {
    title: 'Diablo IV Season of Blood Leveling Blueprint',
    titleVi: 'Lộ trình cày cấp Season of Blood trong Diablo IV',
    shortDescription:
      'Harness vampire powers, malignant tunnels, and Helltide rotations to reach World Tier 4 efficiently.',
    shortDescriptionVi:
      'Tận dụng sức mạnh ma cà rồng, đường hầm Malignant và vòng Helltide để nhanh chóng lên Thế Giới Cấp 4.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1546447147-3fc2b8181c87?auto=format&fit=crop&w=1200&q=80',
    content: `## Seasonal Powers
Unlock Hemomancy early for massive area damage and pair it with Prey on the Weak for crit bursts.

## Efficient Activities
Rotate between Blood Harvest events and Helltide to gather Obols and living steel.

## Gear Priorities
- Imprint offensive aspects on sacred items as soon as you enter World Tier 3.
- Target vampiric pact gear with domination bonuses.`,
    contentVi: `## Sức mạnh mùa giải
Mở khóa Hemomancy sớm để gây sát thương diện rộng và kết hợp với Prey on the Weak nhằm tăng chí mạng.

## Hoạt động hiệu quả
Luân phiên giữa sự kiện Blood Harvest và Helltide để gom Obol và thép sống.

## Ưu tiên trang bị
- Khắc ấn tấn công lên đồ thiêng ngay khi vào Thế Giới Cấp 3.
- Nhắm tới trang bị hiệp ước ma cà rồng có chỉ số khống chế.`,
    tags: ['diablo-iv', 'seasonal', 'guide']
  },
  {
    title: 'Resident Evil 4 Remake S+ Rank Survival Guide',
    titleVi: 'Hướng dẫn đạt hạng S+ trong Resident Evil 4 Remake',
    shortDescription:
      'Route every chapter with knife parries, attache case bonuses, and merchant upgrades to secure S+ on Professional.',
    shortDescriptionVi:
      'Lập lộ trình từng chương với đỡ dao, hộc đồ hỗ trợ và nâng cấp thương nhân để đạt S+ ở độ khó Professional.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=1200&q=80',
    content: `## Perfect Your Parry
Practice the parry timing on basic Ganados before attempting double-claw encounters.

## Money Routing
Always sell elegant masks with matching gems and invest in the exclusive upgrade ticket early.

## Boss Highlights
- Use the bolt thrower with mines to trivialise El Gigante.
- Carry the Killer7 for Krauser's final phase.`,
    contentVi: `## Thuần thục đỡ đòn
Luyện thời gian đỡ dao với Ganado thường trước khi đối mặt kẻ có móng vuốt.

## Quản lý tiền
Luôn bán mặt nạ gắn đủ đá quý và mua vé nâng cấp độc quyền sớm.

## Điểm nhấn trùm
- Dùng nỏ mìn để xử lý El Gigante thật dễ dàng.
- Mang Killer7 cho giai đoạn cuối của Krauser.`,
    tags: ['resident-evil', 'survival', 'action']
  },
  {
    title: 'Street Fighter 6 Modern Controls Meta Breakdown',
    titleVi: 'Phân tích meta điều khiển hiện đại Street Fighter 6',
    shortDescription:
      'Learn why modern controls shine for characters like Marisa and Jamie while classic inputs still dominate zoning.',
    shortDescriptionVi:
      'Tìm hiểu vì sao điều khiển hiện đại tỏa sáng với Marisa và Jamie trong khi kiểu cổ điển vẫn mạnh ở lối chơi kiểm soát.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    content: `## Modern Control Strengths
The simplified specials free up focus for Drive mechanics, especially on aggressive characters.

## Classic Advantages
Zoners like Guile still prefer classic for precise charge timings and optimal punishes.

## Training Tips
- Practice Drive Rush confirms in the training room with frame display.
- Review replays to spot autopilot habits introduced by modern macros.`,
    contentVi: `## Điểm mạnh của điều khiển hiện đại
Chuỗi chiêu đơn giản giúp tập trung vào Drive, đặc biệt với nhân vật thiên công.

## Ưu thế của kiểu cổ điển
Nhân vật kiểm soát như Guile vẫn cần lối cổ điển để canh thời gian tích lực và trừng phạt tối ưu.

## Mẹo luyện tập
- Luyện Drive Rush trong phòng tập với hiển thị khung hình.
- Xem lại replay để sửa lỗi phụ thuộc macro hiện đại.`,
    tags: ['street-fighter-6', 'fighting', 'esports']
  },
  {
    title: 'Hades II Early Access Progression Planner',
    titleVi: 'Kế hoạch tiến trình Early Access cho Hades II',
    shortDescription:
      'Balance witchcraft upgrades, weapon aspects, and surface runs to unlock Melinoë\'s full potential.',
    shortDescriptionVi:
      'Cân bằng nâng cấp phép thuật, khía cạnh vũ khí và chuyến đi mặt đất để khai phóng sức mạnh Melinoë.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    content: `## Prioritise Arcana Cards
Invest in cards that increase magick regeneration and cast damage first.

## Aspect Unlocks
Experiment with the Silver Staff and Sister Blades aspects to cover melee and ranged encounters.

## Surface Expeditions
- Craft lunar wards to survive daylight runs.
- Spend gathered ingredients on cauldron recipes that expand keepsakes.`,
    contentVi: `## Ưu tiên thẻ Arcana
Đầu tư các thẻ tăng hồi ma lực và sát thương phép trước tiên.

## Mở khóa khía cạnh
Thử nghiệm trượng bạc và song đao để ứng phó cận chiến lẫn tầm xa.

## Phiêu lưu mặt đất
- Chế bùa nguyệt quang để tồn tại dưới ánh mặt trời.
- Dùng nguyên liệu thu được cho công thức vạc mở rộng kỷ vật.`,
    tags: ['hades-2', 'roguelike', 'early-access']
  },
  {
    title: 'Hollow Knight: Silksong Preparation Checklist',
    titleVi: 'Danh sách chuẩn bị cho Hollow Knight: Silksong',
    shortDescription:
      'Brush up on movement tech, charms, and lore catches to be ready the moment Hornet\'s new adventure drops.',
    shortDescriptionVi:
      'Ôn luyện kỹ thuật di chuyển, bùa chú và cốt truyện để sẵn sàng khi chuyến phiêu lưu mới của Hornet ra mắt.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    content: `## Revisit Movement Tech
Practice wall bouncing, pogo strikes, and nail parries in the original game to refresh muscle memory.

## Charm Loadouts
Prepare flexible charm builds that balance mobility and survivability.

## Lore Refresher
- Rewatch key cutscenes about the Pale King.
- Read developer interviews to understand Silksong's new factions.`,
    contentVi: `## Ôn kỹ năng di chuyển
Luyện bật tường, nhảy pogo và đỡ kiếm trong bản gốc để khơi lại phản xạ.

## Thiết lập bùa chú
Chuẩn bị cấu hình bùa cân bằng giữa cơ động và sống sót.

## Nhắc lại cốt truyện
- Xem lại các đoạn cắt cảnh về Pale King.
- Đọc phỏng vấn nhà phát triển để hiểu các phe phái mới.`,
    tags: ['hollow-knight', 'metroidvania', 'preview']
  },
  {
    title: 'Monster Hunter Rise: Sunbreak Lance Counter Guide',
    titleVi: 'Hướng dẫn đỡ đòn Lance trong Monster Hunter Rise: Sunbreak',
    shortDescription:
      'Alternate between Guard Reload and Spiral Thrust to bully Master Rank monsters with relentless counters.',
    shortDescriptionVi:
      'Luân phiên Guard Reload và Spiral Thrust để áp đảo quái Master Rank bằng đòn phản kích liên tục.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    content: `## Switch Skill Swap
Use Red Scroll for offensive counters and Blue Scroll for defensive play when monsters enrage.

## Armor Skills
Prioritise Guard 5, Offensive Guard, and Charge Master for explosive damage.

## Hunt Checklist
- Carry Dash Juice to maintain stamina.
- Set up Felvine bombs to keep Palicoes buffed.`,
    contentVi: `## Đổi kỹ năng cuộn
Dùng Cuộn Đỏ cho phản công tấn công và Cuộn Xanh khi quái nổi điên để phòng thủ.

## Kỹ năng giáp
Ưu tiên Guard 5, Offensive Guard và Charge Master để tăng sát thương.

## Chuẩn bị săn
- Mang Dash Juice để duy trì thể lực.
- Đặt bom Felvine giúp Palico luôn được cường hóa.`,
    tags: ['monster-hunter', 'guide', 'action']
  },
  {
    title: 'Apex Legends Ranked Map Rotation Tactics',
    titleVi: 'Chiến thuật xoay tua bản đồ xếp hạng Apex Legends',
    shortDescription:
      'Adapt your drop spots and team comps to Storm Point, Broken Moon, and World\'s Edge in the current split.',
    shortDescriptionVi:
      'Điều chỉnh điểm nhảy và đội hình cho Storm Point, Broken Moon và World\'s Edge trong mùa xếp hạng hiện tại.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    content: `## Storm Point Strategy
Land near the Lightning Rod for high-tier loot then rotate via Gravity Cannons to avoid third parties.

## Broken Moon Insights
Utilise Zip Rails to pinch squads quickly and pair movement legends with recon for scan coverage.

## World\'s Edge Plans
- Contest Fragment only with a confident slayer comp.
- Hold Survey Camp for safe crafting and beacon scans.`,
    contentVi: `## Chiến lược Storm Point
Đáp gần Lightning Rod để lấy đồ xịn rồi dùng Gravity Cannon di chuyển, tránh bị úp sọt.

## Nhận định Broken Moon
Tận dụng Zip Rail để kẹp đội nhanh và kết hợp tướng cơ động với trinh sát để quét bản đồ.

## Kế hoạch World\'s Edge
- Chỉ tranh chấp Fragment khi tự tin với đội hình mạnh.
- Giữ Survey Camp để chế đồ an toàn và quét đài.`,
    tags: ['apex-legends', 'battle-royale', 'esports']
  },
  {
    title: 'Valorant Team Utility Combos for Patch 8',
    titleVi: 'Chuỗi kỹ năng đồng đội Valorant bản 8',
    shortDescription:
      'Synchronise initiator reveals and controller walls to crack default setups on Ascent, Sunset, and Lotus.',
    shortDescriptionVi:
      'Đồng bộ kỹ năng mở giao tranh và tường khói để phá thế phòng thủ trên Ascent, Sunset và Lotus.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    content: `## Ascent Executes
Pair Sova's Recon Dart with Omen's Paranoia to sweep sites safely.

## Sunset Splits
Use Gekko's Wingman to plant behind Harbor walls while Skye flashes CT rotations.

## Lotus Defaults
- Fade prowlers clear close angles for Breach to follow up.
- Save double smokes for retake scenarios around the rotating doors.`,
    contentVi: `## Đánh Ascent
Kết hợp mũi tên trinh sát của Sova với Paranoia của Omen để quét site an toàn.

## Chia đôi Sunset
Dùng Wingman của Gekko đặt spike sau tường Harbor trong khi Skye chói đường CT.

## Kiểm soát Lotus
- Prowler của Fade dọn góc gần cho Breach tiếp cận.
- Giữ hai quả smoke cho tình huống retake quanh cửa xoay.`,
    tags: ['valorant', 'tactics', 'fps']
  },
  {
    title: 'League of Legends Patch 14 Macro Playbook',
    titleVi: 'Sổ tay macro Liên Minh Huyền Thoại phiên bản 14',
    shortDescription:
      'Plan objective trades, vision lines, and split-push windows tailored to the latest item overhaul.',
    shortDescriptionVi:
      'Lên kế hoạch đổi mục tiêu, cắm mắt và thời điểm đẩy lẻ phù hợp với bản cập nhật trang bị mới.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    content: `## Objective Sequencing
Track spawn timers for dragons and heralds, trading side towers when neutral fights look risky.

## Vision Control
Sweep pixel bushes before river contests and invest in control wards around Baron two minutes before spawn.

## Split Push Basics
- Assign champions with TP and dueling tools to side lanes.
- Communicate wave states so teammates stall mid while you pressure.`,
    contentVi: `## Trình tự mục tiêu
Theo dõi thời gian xuất hiện của rồng và sứ giả, sẵn sàng đổi trụ phụ nếu giao tranh trung lập quá mạo hiểm.

## Kiểm soát tầm nhìn
Quét bụi pixel trước khi tranh chấp sông và cắm mắt kiểm soát quanh hang Baron trước hai phút.

## Cơ bản đẩy lẻ
- Giao đường đơn cho tướng có dịch chuyển và khả năng tay đôi.
- Báo trạng thái lính để đồng đội giữ mid trong lúc bạn tạo áp lực.`,
    tags: ['league-of-legends', 'moba', 'strategy']
  },
  {
    title: 'Modern Warfare III Multiplayer Loadout Tracker',
    titleVi: 'Thiết lập vũ khí Multiplayer Modern Warfare III',
    shortDescription:
      'Tune attachments for the MCW, Striker, and Holger 26 to dominate current respawn playlists.',
    shortDescriptionVi:
      'Tinh chỉnh phụ kiện cho MCW, Striker và Holger 26 để thống trị các chế độ respawn hiện tại.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    content: `## MCW Build
Equip the 16.5" MCW Cyclone barrel and extend mags for consistent time-to-kill at mid range.

## Striker SMG
Use the No Stock option plus the DR-6 handstop for maximum mobility during rush plays.

## Holger 26 LMG
- Add the Hybrid Firepoint optic for clarity.
- Pair with the Quick Grip rear handle to offset ADS penalties.`,
    contentVi: `## Cấu hình MCW
Lắp nòng 16.5" MCW Cyclone và băng đạn mở rộng để giữ thời gian hạ gục ổn định tầm trung.

## Striker SMG
Chọn báng gập và tay cầm DR-6 để tăng cơ động khi đánh phủ đầu.

## Holger 26 LMG
- Gắn ống ngắm Hybrid Firepoint cho tầm nhìn rõ.
- Đi kèm tay nắm Quick Grip để bù trừ độ ngắm chậm.`,
    tags: ['call-of-duty', 'fps', 'loadout']
  },
  {
    title: 'Fortnite Chapter 4 Movement Tricks to Master',
    titleVi: 'Các mẹo di chuyển nên biết trong Fortnite Chương 4',
    shortDescription:
      'Slide-kick, kinetic blade hops, and grind rail rotations are the keys to surviving hectic zero-build lobbies.',
    shortDescriptionVi:
      'Đá trượt, nhảy bằng kinetic blade và xoay vòng đường ray là chìa khóa sống sót trong sảnh zero-build hỗn loạn.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
    content: `## Slide-Kick Basics
Aim at enemy builds while sliding to trigger the knockback kick, creating opening damage.

## Kinetic Blade Mobility
Chain double jumps from the blade to cross gaps or reach rooftops without building.

## Grind Rail Routes
- Memorise Mega City rails for safe rotations.
- Combine with Shockwave Hammer launches to escape third parties.`,
    contentVi: `## Cơ bản đá trượt
Nhắm vào công trình địch khi trượt để kích hoạt cú đá hất văng, tạo sát thương mở màn.

## Cơ động với Kinetic Blade
Ghép chuỗi nhảy kép từ kiếm để vượt khoảng trống hoặc lên mái mà không cần xây.

## Lộ trình đường ray
- Thuộc lòng các ray ở Mega City để xoay vòng an toàn.
- Kết hợp với búa Shockwave để thoát giao tranh.`,
    tags: ['fortnite', 'battle-royale', 'tips']
  },
  {
    title: 'Minecraft Legends Co-op Siege Strategies',
    titleVi: 'Chiến thuật công thành co-op trong Minecraft Legends',
    shortDescription:
      'Coordinate hero roles, mount choices, and redstone launchers to dismantle piglin fortresses quickly.',
    shortDescriptionVi:
      'Phối hợp vai trò, thú cưỡi và pháo redstone để đánh sập pháo đài Piglin thật nhanh.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1504610926078-a1611febcad3?auto=format&fit=crop&w=1200&q=80',
    content: `## Assign Roles
Have one player gather resources, another command mobs, and a third focus on siege weapon placement.

## Mount Selection
Use the Big Beak for traversal speed while the Brilliant Beetle climbs fortress walls.

## Siege Execution
- Deploy redstone launchers behind plank golem shields.
- Time banner horn buffs before each assault wave.`,
    contentVi: `## Phân chia vai trò
Một người lo gom tài nguyên, người khác điều khiển quân và người còn lại đặt vũ khí công thành.

## Chọn thú cưỡi
Dùng Big Beak để di chuyển nhanh, còn Brilliant Beetle leo tường pháo đài.

## Triển khai công thành
- Đặt pháo redstone sau hàng khiên golem gỗ.
- Thổi kèn hiệu trước mỗi đợt tấn công để tăng sức mạnh.`,
    tags: ['minecraft-legends', 'strategy', 'co-op']
  }
];

async function ensureAdminAccount() {
  let admin = await User.findOne({ username: ADMIN_USERNAME });
  if (!admin) {
    admin = await User.findOne({ email: ADMIN_EMAIL });
  }
  if (!admin) {
    admin = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      fullName: ADMIN_FULL_NAME,
      role: 'admin'
    });
    return admin;
  }

  let modified = false;
  if (!admin.username) {
    admin.username = ADMIN_USERNAME;
    modified = true;
  }
  if (admin.email !== ADMIN_EMAIL) {
    admin.email = ADMIN_EMAIL;
    modified = true;
  }
  if (admin.fullName !== ADMIN_FULL_NAME) {
    admin.fullName = ADMIN_FULL_NAME;
    modified = true;
  }
  if (admin.role !== 'admin') {
    admin.role = 'admin';
    modified = true;
  }
  if (!admin.isActive) {
    admin.isActive = true;
    modified = true;
  }
  const passwordMatches = await admin.comparePassword(ADMIN_PASSWORD).catch(() => false);
  if (!passwordMatches) {
    admin.password = ADMIN_PASSWORD;
    modified = true;
  }
  if (modified) {
    await admin.save();
  }
  return admin;
}

async function seedDefaultArticles(author) {
  if (!author) return;

  const existingCount = await Article.countDocuments();
  if (existingCount >= defaultArticles.length) {
    return;
  }

  const operations = [];

  defaultArticles.forEach((item, index) => {
    const slug = slugify(item.title, { lower: true, strict: true });
    operations.push(
      (async () => {
        const exists = await Article.findOne({ slug });
        if (exists) return;

        const publishedAt = new Date(Date.now() - index * 86400000);
        await Article.create({
          ...item,
          slug,
          author: author._id,
          publishedAt
        });
      })()
    );
  });

  await Promise.all(operations);
}

export default async function bootstrapData() {
  const admin = await ensureAdminAccount();
  await seedDefaultArticles(admin);
}

export { ensureAdminAccount, seedDefaultArticles };
