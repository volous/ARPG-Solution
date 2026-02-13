using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    [HttpGet("my-gear")]
    public IActionResult GetEquipment()
    {
        Equipment gear = new Equipment
        {
            Weapon = "Rusty Dagger",
            OffHand = "Wooden Shield",
            Helmet = "None",
            BodyArmor = "Cloth Tunic",
            LegArmor = "Old Rags",
            Boots = "Leather Boots",
            Gloves = "None",
            Ring1 = "Copper Band",
            Ring2 = "None",
            Amulet = "Lucky Tooth",
            Belt = "Rope Belt"
        };

        return Ok(gear);
    }
}